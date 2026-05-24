const { getDatabase, saveDatabase } = require('../database')

function queryAll(sql, params = []) {
  const db = getDatabase()
  if (!db) return []
  
  try {
    const result = db.exec(sql, params)
    if (result.length === 0) return []
    
    const columns = result[0].columns
    const values = result[0].values
    
    return values.map(row => {
      const obj = {}
      columns.forEach((col, idx) => {
        obj[col] = row[idx]
      })
      return obj
    })
  } catch (err) {
    console.error('Query error:', err)
    return []
  }
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params)
  return results.length > 0 ? results[0] : null
}

function runSql(sql, params = []) {
  const db = getDatabase()
  if (!db) return null
  
  try {
    db.run(sql, params)
    saveDatabase()
    return { changes: db.getRowsModified() }
  } catch (err) {
    console.error('Run error:', err)
    return null
  }
}

class UserModel {
  static getAll() {
    return queryAll('SELECT * FROM users ORDER BY created_at DESC')
  }

  static getById(id) {
    return queryOne('SELECT * FROM users WHERE id = ?', [id])
  }

  static getByUsername(username) {
    return queryOne('SELECT * FROM users WHERE username = ?', [username])
  }

  static create(userData) {
    const { id, username, password, nickname, email, role, status, permissions } = userData
    const now = Date.now()

    runSql(`
      INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      username,
      password,
      nickname,
      email || null,
      role || 'user',
      status || 'active',
      JSON.stringify(permissions || []),
      now,
      now
    ])

    return { id, ...userData, created_at: now, updated_at: now }
  }

  static update(id, userData) {
    const { password, nickname, email, role, status, permissions } = userData
    const now = Date.now()

    const updates = []
    const params = []

    if (password !== undefined) {
      updates.push('password = ?')
      params.push(password)
    }
    if (nickname !== undefined) {
      updates.push('nickname = ?')
      params.push(nickname)
    }
    if (email !== undefined) {
      updates.push('email = ?')
      params.push(email)
    }
    if (role !== undefined) {
      updates.push('role = ?')
      params.push(role)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
    }
    if (permissions !== undefined) {
      updates.push('permissions = ?')
      params.push(JSON.stringify(permissions))
    }

    updates.push('updated_at = ?')
    params.push(now)
    params.push(id)

    return runSql(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params)
  }

  static delete(id) {
    return runSql('DELETE FROM users WHERE id = ?', [id])
  }

  static getUserProxies(userId) {
    return queryAll('SELECT * FROM proxies WHERE user_id = ? ORDER BY created_at DESC', [userId])
  }

  static assignProxiesToUser(userId, proxyTokens) {
    const now = Date.now()
    for (const token of proxyTokens) {
      runSql('UPDATE proxies SET user_id = ?, updated_at = ? WHERE token = ?', [userId, now, token])
    }
    return { changes: proxyTokens.length }
  }
}

module.exports = UserModel
