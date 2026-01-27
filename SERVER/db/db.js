import pkg from "pg"
import 'dotenv/config'
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // obligatorio para Render
});

export default pool;
