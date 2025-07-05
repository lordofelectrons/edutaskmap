import { Pool } from 'pg';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);

// Comprehensive Neon connection diagnostics
const diagnoseNeonConnection = async () => {
  console.log('🔍 Neon Database Connection Diagnostics');
  console.log('=====================================\n');

  const host = process.env.DB_HOST || 'ep-dark-bush-a96rryhr-pooler.gwc.azure.neon.tech';
  const user = process.env.DB_USER || 'neondb_owner';
  const database = process.env.DB_NAME || 'edutaskmap';
  const port = process.env.DB_PORT || 5432;

  console.log('📋 Configuration:');
  console.log(`- Host: ${host}`);
  console.log(`- User: ${user}`);
  console.log(`- Database: ${database}`);
  console.log(`- Port: ${port}`);
  console.log(`- Password: ${process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]'}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);

  // Test 1: DNS Resolution
  console.log('🌐 Test 1: DNS Resolution');
  try {
    const addresses = await resolve4(host);
    console.log(`✅ DNS resolution successful: ${addresses.join(', ')}`);
  } catch (err) {
    console.log(`❌ DNS resolution failed: ${err.message}`);
    return;
  }

  // Test 2: Basic connection test
  console.log('\n🔌 Test 2: Basic Connection Test');
  const pool = new Pool({
    user,
    host,
    database,
    password: process.env.DB_PASSWORD,
    port,
    ssl: {
      rejectUnauthorized: false,
      sslmode: 'require'
    },
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 15000,
    maxUses: 1,
    keepAlive: false,
    allowExitOnIdle: true,
    application_name: 'edutaskmap-diagnostics',
    statement_timeout: 30000,
  });

  try {
    console.log('Attempting connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    // Test 3: Basic query
    console.log('\n📊 Test 3: Basic Query Test');
    const result = await client.query('SELECT NOW() as current_time, current_database() as db_name, current_user as user_name');
    console.log('✅ Query successful!');
    console.log(`- Current time: ${result.rows[0].current_time}`);
    console.log(`- Database: ${result.rows[0].db_name}`);
    console.log(`- User: ${result.rows[0].user_name}`);
    
    // Test 4: Check if our database exists
    console.log('\n🗄️ Test 4: Database Existence Check');
    const dbResult = await client.query("SELECT datname FROM pg_database WHERE datname = $1", [database]);
    if (dbResult.rows.length > 0) {
      console.log(`✅ Database '${database}' exists`);
    } else {
      console.log(`❌ Database '${database}' does not exist`);
      console.log('Available databases:');
      const allDbs = await client.query("SELECT datname FROM pg_database WHERE datistemplate = false");
      allDbs.rows.forEach(row => console.log(`  - ${row.datname}`));
    }
    
    client.release();
    await pool.end();
    console.log('\n✅ All tests passed! Your Neon connection is working correctly.');
    
  } catch (err) {
    console.log(`❌ Connection failed: ${err.message}`);
    console.log(`Error code: ${err.code}`);
    console.log(`Error detail: ${err.detail || 'N/A'}`);
    
    // Provide specific guidance based on error
    if (err.message.includes('timeout')) {
      console.log('\n🔧 Timeout Issues - Possible Solutions:');
      console.log('1. Check if your Neon database is paused - resume it in the console');
      console.log('2. Verify you are using the pooler endpoint (ends with -pooler)');
      console.log('3. Check if your deployment region can reach Neon');
      console.log('4. Try increasing connection timeout');
    } else if (err.message.includes('authentication')) {
      console.log('\n🔧 Authentication Issues - Possible Solutions:');
      console.log('1. Check your database password');
      console.log('2. Verify the username is correct');
      console.log('3. Check if the user has access to the database');
    } else if (err.message.includes('does not exist')) {
      console.log('\n🔧 Database Issues - Possible Solutions:');
      console.log('1. Create the database in Neon console');
      console.log('2. Check the database name spelling');
      console.log('3. Verify you are connecting to the right project');
    } else if (err.message.includes('SSL')) {
      console.log('\n🔧 SSL Issues - Possible Solutions:');
      console.log('1. Ensure SSL is properly configured');
      console.log('2. Check if your client supports the required SSL version');
    }
    
    await pool.end();
  }
};

// Run diagnostics
diagnoseNeonConnection().catch(console.error); 