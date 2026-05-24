const { queryAll, queryOne, runSql } = require('../database')

class ProxyModel {
  static async getAll() {
    return await queryAll('SELECT * FROM proxies ORDER BY created_at DESC')
  }

  static async getByToken(token) {
    return await queryOne('SELECT * FROM proxies WHERE token = $1', [token])
  }

  static async getActive() {
    const now = Date.now()
    return await queryAll('SELECT * FROM proxies WHERE expire_time > $1 AND status = $2 ORDER BY created_at DESC', [now, 'active'])
  }

  static async getExpired() {
    const now = Date.now()
    return await queryAll('SELECT * FROM proxies WHERE expire_time <= $1 OR status = $2 ORDER BY created_at DESC', [now, 'expired'])
  }

  static async create(proxyData) {
    const { token, phone, targetUrl, expireTime, captchaCode, captchaTime, imageBase64, userId } = proxyData
    const now = Date.now()

    await runSql(`
      INSERT INTO proxies (token, phone, target_url, expire_time, captcha_code, captcha_time, image_base64, user_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      token,
      phone || null,
      targetUrl,
      expireTime,
      captchaCode || null,
      captchaTime || null,
      imageBase64 || null,
      userId || null,
      now,
      now
    ])

    return { id: null, ...proxyData, created_at: now, updated_at: now }
  }

  static async update(token, proxyData) {
    const { phone, targetUrl, expireTime, captchaCode, captchaTime, imageBase64, status, userId } = proxyData
    const now = Date.now()

    const updates = []
    const params = []
    let paramIndex = 1

    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex}`)
      params.push(phone)
      paramIndex++
    }
    if (targetUrl !== undefined) {
      updates.push(`target_url = $${paramIndex}`)
      params.push(targetUrl)
      paramIndex++
    }
    if (expireTime !== undefined) {
      updates.push(`expire_time = $${paramIndex}`)
      params.push(expireTime)
      paramIndex++
    }
    if (captchaCode !== undefined) {
      updates.push(`captcha_code = $${paramIndex}`)
      params.push(captchaCode)
      paramIndex++
    }
    if (captchaTime !== undefined) {
      updates.push(`captcha_time = $${paramIndex}`)
      params.push(captchaTime)
      paramIndex++
    }
    if (imageBase64 !== undefined) {
      updates.push(`image_base64 = $${paramIndex}`)
      params.push(imageBase64)
      paramIndex++
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }
    if (userId !== undefined) {
      updates.push(`user_id = $${paramIndex}`)
      params.push(userId)
      paramIndex++
    }

    updates.push(`updated_at = $${paramIndex}`)
    params.push(now)
    paramIndex++
    params.push(token)

    return await runSql(`UPDATE proxies SET ${updates.join(', ')} WHERE token = $${paramIndex - 1}`, params)
  }

  static async delete(token) {
    return await runSql('DELETE FROM proxies WHERE token = $1', [token])
  }

  static async markAsExpired(token) {
    return await runSql("UPDATE proxies SET status = 'expired', updated_at = $1 WHERE token = $2", [Date.now(), token])
  }

  static async extend(token, additionalTime) {
    const now = Date.now()
    const proxy = await queryOne('SELECT expire_time FROM proxies WHERE token = $1', [token])
    if (proxy) {
      const newExpireTime = proxy.expire_time + additionalTime
      return await runSql('UPDATE proxies SET expire_time = $1, status = $2, updated_at = $3 WHERE token = $4', [newExpireTime, 'active', now, token])
    }
    return null
  }

  static async cleanupExpired() {
    const now = Date.now()
    const expired = await queryAll('SELECT * FROM proxies WHERE expire_time <= $1', [now])
    
    await runSql('DELETE FROM proxies WHERE expire_time <= $1', [now])

    return expired.length
  }

  static async getStats() {
    const now = Date.now()
    const allProxies = await this.getAll()
    const total = allProxies.length
    const active = allProxies.filter(p => p.expire_time > now && p.status === 'active').length
    const expired = total - active

    return { total, active, expired }
  }
}

module.exports = ProxyModel
