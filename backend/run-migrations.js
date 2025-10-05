#!/usr/bin/env node

/**
 * Standalone migration runner
 * Usage: node run-migrations.js
 */

import { runMigrationsWithRetry } from './src/migrations/index.js';

console.log('🚀 Starting standalone migration runner...');

runMigrationsWithRetry()
  .then((success) => {
    if (success) {
      console.log('✅ All migrations completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Migration process failed');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('❌ Migration runner failed:', err.message);
    process.exit(1);
  });
