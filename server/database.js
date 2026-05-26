const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

let db = null
let initialized = false

function getDbPath() {
  const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, 'data', 'database.db')
  const dbDir = path.dirname(dbPath)
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  
  return dbPath
}

function initDatabase() {
  if (initialized) {
    return
  }

  console.log('[DB] Initializing SQLite database...')
  const dbPath = getDbPath()
  console.log('[DB] Database path:', dbPath)

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      permissions TEXT DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS proxies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      phone TEXT,
      target_url TEXT NOT NULL,
      expire_time INTEGER NOT NULL,
      captcha_code TEXT,
      captcha_time TEXT,
      image_base64 TEXT,
      status TEXT DEFAULT 'active',
      user_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  db.exec(`CREATE INDEX IF NOT EXISTS idx_proxies_token ON proxies(token)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_proxies_user_id ON proxies(user_id)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_proxies_expire_time ON proxies(expire_time)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`)

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count

  console.log('[DB] Database contains:', {
    users: userCount,
    proxies: db.prepare('SELECT COUNT(*) as count FROM proxies').get().count
  })

  if (userCount === 0) {
    const now = Date.now()
    
    db.prepare(`
      INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(['admin', 'admin', '123456', '管理员', 'admin@example.com', 'admin', 'active', '["admin"]', now, now])
    
    db.prepare(`
      INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(['editor', 'editor', '123456', '编辑员', 'editor@example.com', 'editor', 'active', '["editor"]', now, now])
    
    db.prepare(`
      INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(['test', 'test', '123456', '测试员', 'test@example.com', 'user', 'active', '["user"]', now, now])
    
    console.log('[DB] Initial users created')
  }

  console.log('[DB] SQLite database initialized successfully')
  initialized = true
}

function queryAll(sql, params = []) {
  if (!db) {
    initDatabase()
  }
  
  try {
    const stmt = db.prepare(sql)
    const rows = params.length > 0 ? stmt.all(...params) : stmt.all()
    return rows.map(row => {
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

function queryOne(sql, params = []) {
  if (!db) {
    initDatabase()
  }
  
  try {
    const stmt = db.prepare(sql)
    const row = params.length > 0 ? stmt.get(...params) : stmt.get()
    
    if (!row) return null
    
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
  } catch (err) {
    console.error('[DB] QueryOne error:', err)
    return null
  }
}

function runSql(sql, params = []) {
  if (!db) {
    initDatabase()
  }
  
  try {
    const stmt = db.prepare(sql)
    const result = params.length > 0 ? stmt.run(...params) : stmt.run()
    return result
  } catch (err) {
    console.error('[DB] Run error:', err)
    return null
  }
}

async function waitForDatabase() {
  initDatabase()
  return db
}

function getDb() {
  return db
}

function deleteAllProxies() {
  if (!db) {
    initDatabase()
  }
  
  try {
    const result = db.prepare('DELETE FROM proxies').run()
    return result.changes
  } catch (err) {
    console.error('[DB] Delete all proxies error:', err)
    return 0
  }
}

function closeDatabase() {
  if (db) {
    db.close()
    db = null
    initialized = false
  }
}

module.exports = {
  queryAll,
  queryOne,
  runSql,
  waitForDatabase,
  getDb,
  initDatabase,
  deleteAllProxies,
  closeDatabase
}
