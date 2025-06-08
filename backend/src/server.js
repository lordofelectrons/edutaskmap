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

// Create classes table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    grade INTEGER NOT NULL CHECK (grade >= 5 AND grade <= 11),
    name TEXT NOT NULL,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE
  )
`);

// Create tasks table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    description TEXT NOT NULL
  )
`);

// GET all schools
app.get('/api/schools', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schools ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST a new school
app.post('/api/schools', async (req, res) => {
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

// GET competencies by school_id
app.get('/api/competencies', async (req, res) => {
  const { school_id } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM competencies
      ${school_id ? 'WHERE competencies.school_id = $1' : ''}
      ORDER BY id`,
      school_id ? [school_id] : []
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST a new competency
app.post('/api/competencies', async (req, res) => {
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

// GET classes by school name and grade
app.get('/api/classes/by-school-and-grade', async (req, res) => {
  const { school_name, grade } = req.query;
  if (!school_name || !grade) {
    return res.status(400).json({ error: 'school_name and grade are required' });
  }
  try {
    const result = await pool.query(
      `SELECT classes.* FROM classes
       JOIN schools ON classes.school_id = schools.id
       WHERE schools.name = $1 AND classes.grade = $2
       ORDER BY classes.id`,
      [school_name, grade]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST a new class
app.post('/api/classes', async (req, res) => {
  const { grade, name, school_id } = req.body;
  if (!grade || !name || !school_id) {
    return res.status(400).json({ error: 'Grade, name, and school_id are required' });
  }
  if (grade < 5 || grade > 11) {
    return res.status(400).json({ error: 'Grade must be between 5 and 11' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO classes (grade, name, school_id) VALUES ($1, $2, $3) RETURNING *',
      [grade, name, school_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Fetch tasks by class_id
app.get('/api/classes/:classId/tasks', async (req, res) => {
  const { classId } = req.params;
  const tasks = await pool.query(
    'SELECT * FROM tasks WHERE class_id = $1',
    [classId]
  );
  if (tasks.length === 0) return res.status(404).json({ error: 'No tasks found for this class' });
  res.json(tasks);
});

// Add a new task by class_id
app.post('/api/classes/:classId/tasks', async (req, res) => {
  const { classId } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  const [result] = await pool.query(
    'INSERT INTO tasks (text, class_id) VALUES ($1, $2)',
    [text, classId]
  );
  if (!result) return res.status(500).json({ error: 'Failed to add task' });
  res.status(201).json({ id: result.insertId, text, class_id: classId });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});