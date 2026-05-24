const initSqlJs = require('sql.js')
const path = require('path')
const fs = require('fs')

const dbDir = path.join(__dirname, '../data')
const dbPath = path.join(dbDir, 'app.db')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

let db = null
let dbReady = null

async function initDatabase() {
  const SQL = await initSqlJs()
  
  let data = null
  if (fs.existsSync(dbPath)) {
    data = fs.readFileSync(dbPath)
  }
  
  db = new SQL.Database(data)
  
  db.run(`
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
  
  db.run(`
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
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_proxies_token ON proxies(token)`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_proxies_user_id ON proxies(user_id)`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_proxies_expire_time ON proxies(expire_time)`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`)
  
  const result = db.exec('SELECT COUNT(*) as count FROM users')
  const count = result.length > 0 ? result[0].values[0][0] : 0
  
  if (count === 0) {
    const now = Date.now()
    db.run(`INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['admin', 'admin', '123456', '管理员', 'admin@example.com', 'admin', 'active', '["admin"]', now, now])
    db.run(`INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['editor', 'editor', '123456', '编辑员', 'editor@example.com', 'editor', 'active', '["editor"]', now, now])
    db.run(`INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['test', 'test', '123456', '测试员', 'test@example.com', 'user', 'active', '["user"]', now, now])
    console.log('[DB] Initial users created')
  }
  
  saveDatabase()
  
  return db
}

function saveDatabase() {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  }
}

function getDatabase() {
  return db
}

function waitForDatabase() {
  return dbReady
}

dbReady = initDatabase()

module.exports = {
  getDatabase,
  saveDatabase,
  waitForDatabase
}
