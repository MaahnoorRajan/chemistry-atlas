import postgres from 'postgres';

const tables = [
 'assignments','attempts','rooms','members','notebooks','attempt_history','teacher_requests',
 'demo_sessions','demo_assignments','demo_attempts','demo_rooms','demo_members','demo_notebooks','demo_attempt_history'
];
const tablePattern = new RegExp('\\b(' + tables.join('|') + ')\\b','g');

function translate(statement) {
 let index=0;
 return statement.replace(tablePattern,table=>'"chemistry_atlas"."' + table + '"')
  .replace(/\?/g,()=>'$'+(++index))
  .replace(/CURRENT_TIMESTAMP/g,"to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS')");
}

export function database(connectionString) {
 const sql=postgres(connectionString,{prepare:false,max:3,idle_timeout:20,connect_timeout:10,ssl:'require'});
 function prepared(statement,args=[]) {
  const command=translate(statement);
  const execute=connection=>connection.unsafe(command,args);
  return {
   bind:(...values)=>prepared(statement,values),
   first:async()=> (await execute(sql))[0]||null,
   all:async()=>({results:Array.from(await execute(sql))}),
   run:async()=>({meta:{changes:(await execute(sql)).count}}),
   execute
  };
 }
 return {
  prepare:prepared,
  batch:statements=>sql.begin(async transaction=>{
   const results=[];
   for(const statement of statements){const result=await statement.execute(transaction);results.push({meta:{changes:result.count}});}
   return results;
  })
 };
}
