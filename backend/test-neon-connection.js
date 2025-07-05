import { Pool } from 'pg';

// Test Neon connection with the same settings as your server
const testNeonConnection = async () => {
  console.log('Testing Neon database connection...');
  
  const pool = new Pool({
    user: process.env.DB_USER || 'neondb_owner',
    host: process.env.DB_HOST || 'ep-dark-bush-a96rryhr-pooler.gwc.azure.neon.tech',
    database: process.env.DB_NAME || 'edutaskmap',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
      rejectUnauthorized: false,
      sslmode: 'require'
    },
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    maxUses: 1,
    keepAlive: false,
    allowExitOnIdle: true,
  });

  try {
    console.log('Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].pg_version.split(' ')[0]);
    
    client.release();
    await pool.end();
    console.log('✅ Test completed successfully!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Error details:', err);
    
    if (err.message.includes('timeout')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check if your Neon database is running');
      console.log('2. Verify you are using the pooler endpoint (ends with -pooler)');
      console.log('3. Check your database credentials');
      console.log('4. Ensure your IP is not blocked');
    }
  }
};

// Run the test
testNeonConnection(); 