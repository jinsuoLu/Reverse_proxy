const { queryAll, queryOne, runSql } = require('../database')

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
