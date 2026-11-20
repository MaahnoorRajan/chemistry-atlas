import worker from '../dist/server/index.js';
import { database } from '../worker/postgres.mjs';

let db;
export default {
 async fetch(request) {
  if (!process.env.DATABASE_URL) return Response.json({error:'Database setup required'},{status:503});
  db ||= database(process.env.DATABASE_URL);
  return worker.fetch(request,{...process.env,DB:db});
 }
};
