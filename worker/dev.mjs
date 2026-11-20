import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import worker from '../dist/server/index.js';

const root = new URL('../', import.meta.url);
const localEnv = new URL('.env.local', root);
if (existsSync(localEnv)) process.loadEnvFile(fileURLToPath(localEnv));

const localDirectory = new URL('.local/', root);
mkdirSync(localDirectory, {recursive:true});
const sqlite = new DatabaseSync(fileURLToPath(new URL('atlas.sqlite',localDirectory)));
sqlite.exec('PRAGMA foreign_keys=ON');
sqlite.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY NOT NULL)');
const migrations = new URL('drizzle/', root);
for (const name of readdirSync(migrations).filter(name=>name.endsWith('.sql')).sort()) {
  if (sqlite.prepare('SELECT name FROM local_migrations WHERE name=?').get(name)) continue;
  sqlite.exec('BEGIN');
  try {
    sqlite.exec(readFileSync(new URL(name,migrations),'utf8'));
    sqlite.prepare('INSERT INTO local_migrations(name) VALUES(?)').run(name);
    sqlite.exec('COMMIT');
  } catch(error) {
    sqlite.exec('ROLLBACK');
    throw error;
  }
}

function prepared(statement,args=[]) {
  return {
    bind:(...values)=>prepared(statement,values),
    first:()=>sqlite.prepare(statement).get(...args)||null,
    all:()=>({results:sqlite.prepare(statement).all(...args)}),
    run:()=>({meta:sqlite.prepare(statement).run(...args)})
  };
}
const DB = {
  prepare:prepared,
  batch(statements) {
    sqlite.exec('BEGIN');
    try {
      const results=statements.map(statement=>statement.run());
      sqlite.exec('COMMIT');
      return results;
    } catch(error) {
      sqlite.exec('ROLLBACK');
      throw error;
    }
  }
};
const port=Number(process.env.PORT||3000);
const origin='http://localhost:'+port;
const env = {
  ...process.env, DB,
  SUPABASE_URL:process.env.SUPABASE_URL||process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY:process.env.SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SITE_AUTH_ORIGIN:origin,
  AUTH_MODE:'google',
  AUTH_EMAIL_READY:'false',
  DEMO_SESSION_KEY:process.env.DEMO_SESSION_KEY||crypto.randomUUID()
};
const server=createServer(async (req,res)=>{
  try {
    const url=new URL(req.url,origin);
    if(!['localhost','127.0.0.1','[::1]'].includes(new URL('http://'+req.headers.host).hostname)){
      res.writeHead(403).end('Local access only');
      return;
    }
    const chunks=[];
    let size=0;
    for await (const chunk of req) {
      size+=chunk.length;
      if(size>256*1024){res.writeHead(413).end('Request too large');return;}
      chunks.push(chunk);
    }
    const headers=new Headers();
    for(const [name,value] of Object.entries(req.headers))if(value!==undefined)headers.set(name,Array.isArray(value)?value.join(', '):value);
    const request=new Request(url,{method:req.method,headers,body:chunks.length?Buffer.concat(chunks):undefined});
    const response=await worker.fetch(request,env);
    res.statusCode=response.status;
    for(const [name,value] of response.headers)if(name!=='set-cookie')res.setHeader(name,value);
    const cookies=response.headers.getSetCookie();
    if(cookies.length)res.setHeader('Set-Cookie',cookies);
    res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error) {
    console.error(error.message);
    if(!res.headersSent)res.writeHead(500,{'Content-Type':'text/plain'});
    res.end('The local server could not complete this request.');
  }
});
server.listen(port,'127.0.0.1',()=>console.log('Chemistry Atlas is running at '+origin));
server.on('error',error=>{console.error(error.message);process.exitCode=1;sqlite.close();});
