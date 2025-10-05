import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'edutaskmap',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
    sslmode: 'require',
    ca: undefined,
    key: undefined,
    cert: undefined
  } : false,
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 15000,
  maxUses: 1,
  keepAlive: false,
  allowExitOnIdle: true,
  application_name: 'edutaskmap-migrations',
  statement_timeout: 30000,
});

// Helper function for database operations
const executeQuery = async (query, params = []) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result;
  } catch (err) {
    console.error('Migration query error:', err.message);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Create migrations table if it doesn't exist
const createMigrationsTable = async () => {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Migrations table created/verified');
  } catch (err) {
    console.error('Error creating migrations table:', err);
    throw err;
  }
};

// Check if a migration has been executed
const isMigrationExecuted = async (migrationName) => {
  try {
    const result = await executeQuery(
      'SELECT id FROM migrations WHERE migration_name = $1',
      [migrationName]
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error('Error checking migration status:', err);
    return false;
  }
};

// Mark a migration as executed
const markMigrationExecuted = async (migrationName) => {
  try {
    await executeQuery(
      'INSERT INTO migrations (migration_name) VALUES ($1)',
      [migrationName]
    );
    console.log(`✅ Migration marked as executed: ${migrationName}`);
  } catch (err) {
    console.error('Error marking migration as executed:', err);
    throw err;
  }
};

// Load SQL migration files from the sql directory
const loadSQLMigrations = () => {
  const migrationsDir = path.join(__dirname, '../../migrations/sql');
  const migrations = [];

  try {
    if (!fs.existsSync(migrationsDir)) {
      console.log('No SQL migrations directory found');
      return migrations;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && !file.includes('rollback') && !file.includes('TEMPLATE'))
      .sort(); // Sort to ensure proper order

    for (const file of files) {
      const migrationName = file.replace('.sql', '');
      const sqlPath = path.join(migrationsDir, file);
      const jsonPath = path.join(migrationsDir, `${migrationName}.json`);

      try {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        let metadata = {};

        // Try to load metadata if JSON file exists
        if (fs.existsSync(jsonPath)) {
          try {
            metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          } catch (err) {
            console.warn(`Warning: Could not parse metadata for ${migrationName}:`, err.message);
          }
        }

        migrations.push({
          name: migrationName,
          description: metadata.description || `Migration ${migrationName}`,
          sql: sql,
          metadata: metadata
        });

        console.log(`📄 Loaded SQL migration: ${migrationName}`);
      } catch (err) {
        console.error(`Error loading migration ${file}:`, err.message);
      }
    }

    console.log(`📁 Loaded ${migrations.length} SQL migrations`);
  } catch (err) {
    console.error('Error loading SQL migrations:', err.message);
  }

  return migrations;
};

// Execute SQL migration
const executeSQLMigration = async (migration) => {
  console.log(`🚀 Executing SQL migration: ${migration.name}`);
  console.log(`📝 Description: ${migration.description}`);

  try {
    // Execute the SQL migration
    await executeQuery(migration.sql);
    console.log(`✅ SQL migration completed: ${migration.name}`);
    return true;
  } catch (err) {
    console.error(`❌ SQL migration failed: ${migration.name}`, err.message);
    throw err;
  }
};

// Load migrations dynamically from SQL files
const getMigrations = () => {
  return loadSQLMigrations();
};

// Run all pending migrations
export const runMigrations = async () => {
  console.log('🔄 Starting database migrations...');
  
  try {
    // Create migrations table first
    await createMigrationsTable();
    
    // Load migrations from SQL files
    const migrations = getMigrations();
    
    if (migrations.length === 0) {
      console.log('📁 No SQL migrations found');
      return true;
    }
    
    // Run each migration
    for (const migration of migrations) {
      const isExecuted = await isMigrationExecuted(migration.name);
      
      if (!isExecuted) {
        try {
          await executeSQLMigration(migration);
          await markMigrationExecuted(migration.name);
          console.log(`✅ Migration completed: ${migration.name}`);
        } catch (err) {
          console.error(`❌ Migration failed: ${migration.name}`, err.message);
          throw err;
        }
      } else {
        console.log(`⏭️  Migration already executed: ${migration.name}`);
      }
    }
    
    console.log('✅ All migrations completed successfully!');
    return true;
  } catch (err) {
    console.error('❌ Migration process failed:', err.message);
    throw err;
  }
};

// Run migrations with retry logic
export const runMigrationsWithRetry = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Migration attempt ${attempt}/${maxRetries}`);
      await runMigrations();
      return true;
    } catch (err) {
      console.error(`Migration attempt ${attempt} failed:`, err.message);
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All migration attempts failed');
        return false;
      }
    }
  }
  return false;
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing migration pool');
  pool.end();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing migration pool');
  pool.end();
});
