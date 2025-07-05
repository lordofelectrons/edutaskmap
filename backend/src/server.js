import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint for Vercel
app.get('/', (req, res) => {
  res.json({ message: 'EduTaskMap Backend API is running!' });
});

// Database configuration with proper connection handling
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'edutaskmap',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
  // Neon-specific SSL configuration
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
  // Connection pool settings optimized for serverless environments
  max: 1, // Single connection for serverless (prevents connection pool issues)
  idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
  connectionTimeoutMillis: 10000, // Increased timeout for Neon
  maxUses: 1, // Use connection only once (important for serverless)
  // Additional settings for Neon
  keepAlive: false, // Disable keep-alive for serverless
  allowExitOnIdle: true, // Allow pool to exit when idle
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection on startup
const testConnection = async () => {
  // Log all environment variables except password
  console.log('=== Database Connection Attempt ===');
  console.log('Environment variables:');
  console.log('- DB_USER:', process.env.DB_USER || 'admin (default)');
  console.log('- DB_HOST:', process.env.DB_HOST || 'localhost (default)');
  console.log('- DB_NAME:', process.env.DB_NAME || 'edutaskmap (default)');
  console.log('- DB_PORT:', process.env.DB_PORT || '5432 (default)');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development (default)');
  console.log('- PORT:', process.env.PORT || '3001 (default)');
  console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : 'admin (default)');
  
  // Check if using Neon and provide specific guidance
  if (process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech')) {
    console.log('=== Neon Database Detected ===');
    console.log('Using Neon database. Make sure you are using:');
    console.log('1. Pooler endpoint (ends with -pooler)');
    console.log('2. Correct SSL configuration');
    console.log('3. Database exists in Neon console');
    console.log('4. Connection string format: postgresql://user:pass@host:port/dbname');
    console.log('================================');
  }
  console.log('===================================');
  
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    // Don't exit process, let it continue and retry on first request
  }
};

testConnection();

// Helper function for database operations with proper error handling
const executeQuery = async (query, params = []) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result;
  } catch (err) {
    console.error('Database query error:', err.message);
    // Log additional details for Neon-specific issues
    if (err.message.includes('timeout') || err.message.includes('terminated')) {
      console.error('This appears to be a Neon connection issue. Check:');
      console.error('1. SSL configuration is correct');
      console.error('2. Connection string uses the pooler endpoint');
      console.error('3. Database is accessible from your deployment region');
    }
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Initialize database tables with proper error handling
const initializeDatabase = async () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS schools (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS competencies (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS classes (
      id SERIAL PRIMARY KEY,
      grade INTEGER NOT NULL CHECK (grade >= 5 AND grade <= 11),
      name TEXT NOT NULL,
      school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
      description TEXT NOT NULL
    )`
  ];

  for (const tableQuery of tables) {
    try {
      await executeQuery(tableQuery);
      console.log('Table created/verified successfully');
    } catch (err) {
      console.error('Error creating table:', err);
      // Continue with other tables even if one fails
    }
  }
};

// Initialize database tables
initializeDatabase();

// GET all schools
app.get('/api/schools', async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM schools ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST a new school
app.post('/api/schools', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'School name is required' });
  }

  try {
    const result = await executeQuery(
      'INSERT INTO schools (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating school:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// GET competencies by school_id
app.get('/api/competencies', async (req, res) => {
  const { school_id } = req.query;
  try {
    const result = await executeQuery(
      `SELECT * FROM competencies
      ${school_id ? 'WHERE competencies.school_id = $1' : ''}
      ORDER BY id`,
      school_id ? [school_id] : []
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching competencies:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST a new competency
app.post('/api/competencies', async (req, res) => {
  const { name, school_id } = req.body;
  if (!name || !school_id) {
    return res.status(400).json({ error: 'Name and school_id are required' });
  }

  try {
    const result = await executeQuery(
      'INSERT INTO competencies (name, school_id) VALUES ($1, $2) RETURNING *',
      [name, school_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating competency:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// GET classes by school name and grade
app.get('/api/classes/by-school-and-grade', async (req, res) => {
  const { school_name, grade } = req.query;
  if (!school_name || !grade) {
    return res.status(400).json({ error: 'school_name and grade are required' });
  }
  try {
    const result = await executeQuery(
      `SELECT classes.* FROM classes
       JOIN schools ON classes.school_id = schools.id
       WHERE schools.name = $1 AND classes.grade = $2
       ORDER BY classes.id`,
      [school_name, grade]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
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
    const result = await executeQuery(
      'INSERT INTO classes (grade, name, school_id) VALUES ($1, $2, $3) RETURNING *',
      [grade, name, school_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Fetch tasks by class_id
app.get('/api/classes/:classId/tasks', async (req, res) => {
  const { classId } = req.params;
  try {
    const result = await executeQuery(
      'SELECT * FROM tasks WHERE class_id = $1',
      [classId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No tasks found for this class' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Add a new task by class_id
app.post('/api/classes/:classId/tasks', async (req, res) => {
  const { classId } = req.params;
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description is required' });
  
  try {
    const result = await executeQuery(
      'INSERT INTO tasks (description, class_id) VALUES ($1, $2) RETURNING *',
      [description, classId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
});