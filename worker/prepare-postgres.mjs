import fs from 'node:fs';
const names=fs.readdirSync('drizzle').filter(name=>name.endsWith('.sql')).sort();
let schema=names.map(name=>fs.readFileSync('drizzle/'+name,'utf8')).join('\n')
 .replace(/--> statement-breakpoint/g,'')
 .replaceAll('upper(hex(randomblob(4)))',"upper(substr(md5(random()::text),1,8))")
 .replace(/DEFAULT CURRENT_TIMESTAMP/g,"DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS')");
schema="CREATE SCHEMA IF NOT EXISTS chemistry_atlas;\nREVOKE ALL ON SCHEMA chemistry_atlas FROM PUBLIC, anon, authenticated;\nSET search_path=chemistry_atlas,public;\n"+schema;
fs.mkdirSync('postgres',{recursive:true});
fs.writeFileSync('postgres/schema.sql',schema);
