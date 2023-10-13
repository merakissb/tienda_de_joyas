// path: db/pool.js

import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'joyas',
  port: 5432
});