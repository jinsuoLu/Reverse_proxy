const { Pool } = require('pg')
const path = require('path')

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/reverse_proxy'

let pool = null
let initialized = false

async function initDatabase() {
  if (initialized) {
    return
  }

  console.log('[DB] Initializing PostgreSQL database...')
  console.log('[DB] Connection string:', connectionString.replace(/\/\/.*:.*@/, '//****:****@'))

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('neon.tech') || connectionString.includes('supabase') 
      ? { rejectUnauthorized: false }
      : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  pool.on('error', (err) => {
    console.error('[DB] Unexpected error on idle client:', err)
  })

  const client = await pool.connect()
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'active',
        permissions TEXT DEFAULT '[]',
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS proxies (
        id SERIAL PRIMARY KEY,
        token TEXT UNIQUE NOT NULL,
        phone TEXT,
        target_url TEXT NOT NULL,
        expire_time BIGINT NOT NULL,
        captcha_code TEXT,
        captcha_time TEXT,
        image_base64 TEXT,
        status TEXT DEFAULT 'active',
        user_id TEXT,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    await client.query(`CREATE INDEX IF NOT EXISTS idx_proxies_token ON proxies(token)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_proxies_user_id ON proxies(user_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_proxies_expire_time ON proxies(expire_time)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`)

    const result = await client.query('SELECT COUNT(*) as count FROM users')
    const count = parseInt(result.rows[0].count)

    console.log('[DB] Database contains:', {
      users: count,
      proxies: 'checking...'
    })

    if (count === 0) {
      const now = Date.now()
      await client.query(`
        INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, ['admin', 'admin', '123456', '管理员', 'admin@example.com', 'admin', 'active', '["admin"]', now, now])
      
      await client.query(`
        INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, ['editor', 'editor', '123456', '编辑员', 'editor@example.com', 'editor', 'active', '["editor"]', now, now])
      
      await client.query(`
        INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, ['test', 'test', '123456', '测试员', 'test@example.com', 'user', 'active', '["user"]', now, now])
      
      console.log('[DB] Initial users created')
    }

    const proxyResult = await client.query('SELECT COUNT(*) as count FROM proxies')
    console.log('[DB] Database contains:', {
      users: count,
      proxies: parseInt(proxyResult.rows[0].count)
    })

    console.log('[DB] PostgreSQL database initialized successfully')
    initialized = true
  } finally {
    client.release()
  }
}

async function queryAll(sql, params = []) {
  if (!pool) {
    await initDatabase()
  }
  
  try {
    const result = await pool.query(sql, params)
    return result.rows.map(row => {
      const convertedRow = { ...row }
      if (convertedRow.expire_time !== undefined && convertedRow.expire_time !== null) {
        convertedRow.expire_time = Number(convertedRow.expire_time)
      }
      if (convertedRow.created_at !== undefined && convertedRow.created_at !== null) {
        convertedRow.created_at = Number(convertedRow.created_at)
      }
      if (convertedRow.updated_at !== undefined && convertedRow.updated_at !== null) {
        convertedRow.updated_at = Number(convertedRow.updated_at)
      }
      return convertedRow
    })
  } catch (err) {
    console.error('[DB] Query error:', err)
    return []
  }
}

async function queryOne(sql, params = []) {
  const rows = await queryAll(sql, params)
  return rows.length > 0 ? rows[0] : null
}

async function runSql(sql, params = []) {
  if (!pool) {
    await initDatabase()
  }
  
  try {
    const result = await pool.query(sql, params)
    return result
  } catch (err) {
    console.error('[DB] Run error:', err)
    return null
  }
}

async function waitForDatabase() {
  await initDatabase()
  return pool
}

function getPool() {
  return pool
}

module.exports = {
  queryAll,
  queryOne,
  runSql,
  waitForDatabase,
  getPool,
  initDatabase
}
