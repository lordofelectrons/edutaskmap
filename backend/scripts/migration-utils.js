#!/usr/bin/env node

/**
 * Migration utility scripts
 * Usage: node scripts/migration-utils.js [command] [options]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '../migrations/sql');

// Commands
const commands = {
  list: listMigrations,
  create: createMigration,
  status: showStatus,
  help: showHelp
};

// List all available migrations
function listMigrations() {
  console.log('📁 Available SQL Migrations:');
  console.log('============================');
  
  try {
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found');
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && !file.includes('rollback') && !file.includes('TEMPLATE'))
      .sort();

    if (files.length === 0) {
      console.log('No migrations found');
      return;
    }

    files.forEach((file, index) => {
      const migrationName = file.replace('.sql', '');
      const jsonPath = path.join(migrationsDir, `${migrationName}.json`);
      
      let metadata = {};
      if (fs.existsSync(jsonPath)) {
        try {
          metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        } catch (err) {
          console.warn(`Warning: Could not parse metadata for ${migrationName}`);
        }
      }

      console.log(`${index + 1}. ${migrationName}`);
      if (metadata.description) {
        console.log(`   Description: ${metadata.description}`);
      }
      if (metadata.author) {
        console.log(`   Author: ${metadata.author}`);
      }
      if (metadata.created_at) {
        console.log(`   Created: ${metadata.created_at}`);
      }
      console.log('');
    });
  } catch (err) {
    console.error('Error listing migrations:', err.message);
  }
}

// Create a new migration
function createMigration() {
  const args = process.argv.slice(3);
  const migrationName = args[0];
  
  if (!migrationName) {
    console.error('❌ Please provide a migration name');
    console.log('Usage: node scripts/migration-utils.js create <migration_name>');
    return;
  }

  // Get next migration number
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql') && !file.includes('rollback') && !file.includes('TEMPLATE'))
    .sort();

  const nextNumber = files.length > 0 
    ? String(parseInt(files[files.length - 1].split('_')[0]) + 1).padStart(3, '0')
    : '001';

  const fileName = `${nextNumber}_${migrationName}`;
  const sqlFile = path.join(migrationsDir, `${fileName}.sql`);
  const jsonFile = path.join(migrationsDir, `${fileName}.json`);

  // Check if files already exist
  if (fs.existsSync(sqlFile) || fs.existsSync(jsonFile)) {
    console.error(`❌ Migration ${fileName} already exists`);
    return;
  }

  try {
    // Read template files
    const templateSQL = fs.readFileSync(path.join(migrationsDir, 'TEMPLATE.sql'), 'utf8');
    const templateJSON = fs.readFileSync(path.join(migrationsDir, 'TEMPLATE.json'), 'utf8');

    // Replace template placeholders
    const sqlContent = templateSQL
      .replace(/XXX/g, nextNumber)
      .replace(/your_migration_name/g, migrationName)
      .replace(/YYYY-MM-DD/g, new Date().toISOString().split('T')[0]);

    const jsonContent = templateJSON
      .replace(/XXX_your_migration_name/g, fileName)
      .replace(/Your Name/g, 'EduTaskMap Team')
      .replace(/YYYY-MM-DDTHH:mm:ssZ/g, new Date().toISOString());

    // Write files
    fs.writeFileSync(sqlFile, sqlContent);
    fs.writeFileSync(jsonFile, jsonContent);

    console.log(`✅ Created migration: ${fileName}`);
    console.log(`📄 SQL file: ${sqlFile}`);
    console.log(`📋 JSON file: ${jsonFile}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Edit the SQL file to add your migration logic');
    console.log('2. Update the JSON metadata file');
    console.log('3. Test the migration with: npm run migrate');

  } catch (err) {
    console.error('Error creating migration:', err.message);
  }
}

// Show migration status
function showStatus() {
  console.log('📊 Migration Status:');
  console.log('===================');
  
  try {
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found');
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && !file.includes('rollback') && !file.includes('TEMPLATE'))
      .sort();

    console.log(`Total migrations found: ${files.length}`);
    console.log('');
    
    files.forEach((file, index) => {
      const migrationName = file.replace('.sql', '');
      const sqlPath = path.join(migrationsDir, file);
      const jsonPath = path.join(migrationsDir, `${migrationName}.json`);
      
      const stats = fs.statSync(sqlPath);
      console.log(`${index + 1}. ${migrationName}`);
      console.log(`   SQL: ${fs.existsSync(sqlPath) ? '✅' : '❌'} (${Math.round(stats.size / 1024)}KB)`);
      console.log(`   JSON: ${fs.existsSync(jsonPath) ? '✅' : '❌'}`);
      console.log(`   Modified: ${stats.mtime.toISOString()}`);
      console.log('');
    });
  } catch (err) {
    console.error('Error showing status:', err.message);
  }
}

// Show help
function showHelp() {
  console.log('🔧 Migration Utilities');
  console.log('======================');
  console.log('');
  console.log('Commands:');
  console.log('  list                    - List all available migrations');
  console.log('  create <name>          - Create a new migration');
  console.log('  status                 - Show migration file status');
  console.log('  help                   - Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/migration-utils.js list');
  console.log('  node scripts/migration-utils.js create add_user_table');
  console.log('  node scripts/migration-utils.js status');
}

// Main execution
function main() {
  const command = process.argv[2] || 'help';
  
  if (commands[command]) {
    commands[command]();
  } else {
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
