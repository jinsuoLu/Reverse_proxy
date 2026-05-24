const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbDir = path.join(__dirname, '../data')
const dbPath = path.join(dbDir, 'app.db')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

let db = null

function initDatabase() {
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  
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
  
  const result = db.prepare('SELECT COUNT(*) as count FROM users').get()
  const count = result.count
  
  if (count === 0) {
    const now = Date.now()
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    insertUser.run('admin', 'admin', '123456', '管理员', 'admin@example.com', 'admin', 'active', '["admin"]', now, now)
    insertUser.run('editor', 'editor', '123456', '编辑员', 'editor@example.com', 'editor', 'active', '["editor"]', now, now)
    insertUser.run('test', 'test', '123456', '测试员', 'test@example.com', 'user', 'active', '["user"]', now, now)
    console.log('[DB] Initial users created')
  }
  
  console.log('[DB] Database initialized')
  return db
}

function getDatabase() {
  if (!db) {
    db = initDatabase()
  }
  return db
}

function waitForDatabase() {
  if (!db) {
    db = initDatabase()
  }
  return Promise.resolve(db)
}

function runSql(sql, params = []) {
  try {
    const stmt = db.prepare(sql)
    const info = stmt.run(...params)
    return info
  } catch (err) {
    console.error('Run error:', err)
    return null
  }
}

function queryAll(sql, params = []) {
  try {
    const stmt = db.prepare(sql)
    return stmt.all(...params)
  } catch (err) {
    console.error('Query error:', err)
    return []
  }
}

function queryOne(sql, params = []) {
  try {
    const stmt = db.prepare(sql)
    return stmt.get(...params)
  } catch (err) {
    console.error('Query error:', err)
    return null
  }
}

// Initialize database on module load
initDatabase()

module.exports = {
  getDatabase,
  waitForDatabase,
  queryAll,
  queryOne,
  runSql
}
