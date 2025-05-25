import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'edutaskmap',
  password: 'admin',
  port: 5432,
});

// Create school table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  )
`);

// Create competency table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS competencies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE
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

// GET all competencies
app.get('/competencies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM competencies ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST a new competency
app.post('/competencies', async (req, res) => {
  const { name, school_id } = req.body;
  if (!name || !school_id) {
    return res.status(400).json({ error: 'Name and school_id are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO competencies (name, school_id) VALUES ($1, $2) RETURNING *',
      [name, school_id]
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