import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import { json } from 'body-parser';

const app = express();
const port = 3001;

app.use(cors());
app.use(json());

// PostgreSQL pool setup — adjust credentials as needed
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  )
`);

// GET all schools
app.get('/schools', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schools ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST a new school
app.post('/schools', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'School name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO schools (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});