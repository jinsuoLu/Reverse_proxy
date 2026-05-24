const { queryAll, queryOne, runSql } = require('../database')

class UserModel {
  static async getAll() {
    return await queryAll('SELECT * FROM users ORDER BY created_at DESC')
  }

  static async getById(id) {
    return await queryOne('SELECT * FROM users WHERE id = $1', [id])
  }

  static async getByUsername(username) {
    return await queryOne('SELECT * FROM users WHERE username = $1', [username])
  }

  static async create(userData) {
    const { id, username, password, nickname, email, role, status, permissions } = userData
    const now = Date.now()

    await runSql(`
      INSERT INTO users (id, username, password, nickname, email, role, status, permissions, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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

  static async update(id, userData) {
    const { password, nickname, email, role, status, permissions } = userData
    const now = Date.now()

    const updates = []
    const params = []
    let paramIndex = 1

    if (password !== undefined) {
      updates.push(`password = $${paramIndex}`)
      params.push(password)
      paramIndex++
    }
    if (nickname !== undefined) {
      updates.push(`nickname = $${paramIndex}`)
      params.push(nickname)
      paramIndex++
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`)
      params.push(email)
      paramIndex++
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex}`)
      params.push(role)
      paramIndex++
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }
    if (permissions !== undefined) {
      updates.push(`permissions = $${paramIndex}`)
      params.push(JSON.stringify(permissions))
      paramIndex++
    }

    updates.push(`updated_at = $${paramIndex}`)
    params.push(now)
    paramIndex++
    params.push(id)

    return await runSql(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex - 1}`, params)
  }

  static async delete(id) {
    return await runSql('DELETE FROM users WHERE id = $1', [id])
  }

  static async getUserProxies(userId) {
    return await queryAll('SELECT * FROM proxies WHERE user_id = $1 ORDER BY created_at DESC', [userId])
  }

  static async assignProxiesToUser(userId, proxyTokens) {
    const now = Date.now()
    for (const token of proxyTokens) {
      await runSql('UPDATE proxies SET user_id = $1, updated_at = $2 WHERE token = $3', [userId, now, token])
    }
    return { changes: proxyTokens.length }
  }
}

module.exports = UserModel
