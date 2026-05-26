const { queryAll, queryOne, runSql } = require('../database')

class ProxyModel {
  static async getAll() {
    return await queryAll('SELECT * FROM proxies ORDER BY created_at DESC')
  }

  static async getByToken(token) {
    return await queryOne('SELECT * FROM proxies WHERE token = ?', [token])
  }

  static async getActive() {
    const now = Date.now()
    return await queryAll('SELECT * FROM proxies WHERE expire_time > ? AND status = ? ORDER BY created_at DESC', [now, 'active'])
  }

  static async getExpired() {
    const now = Date.now()
    return await queryAll('SELECT * FROM proxies WHERE expire_time <= ? OR status = ? ORDER BY created_at DESC', [now, 'expired'])
  }

  static async create(proxyData) {
    const { token, phone, targetUrl, expireTime, captchaCode, captchaTime, imageBase64, userId } = proxyData
    const now = Date.now()

    await runSql(`
      INSERT INTO proxies (token, phone, target_url, expire_time, captcha_code, captcha_time, image_base64, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

    if (phone !== undefined) {
      updates.push(`phone = ?`)
      params.push(phone)
    }
    if (targetUrl !== undefined) {
      updates.push(`target_url = ?`)
      params.push(targetUrl)
    }
    if (expireTime !== undefined) {
      updates.push(`expire_time = ?`)
      params.push(expireTime)
    }
    if (captchaCode !== undefined) {
      updates.push(`captcha_code = ?`)
      params.push(captchaCode)
    }
    if (captchaTime !== undefined) {
      updates.push(`captcha_time = ?`)
      params.push(captchaTime)
    }
    if (imageBase64 !== undefined) {
      updates.push(`image_base64 = ?`)
      params.push(imageBase64)
    }
    if (status !== undefined) {
      updates.push(`status = ?`)
      params.push(status)
    }
    if (userId !== undefined) {
      updates.push(`user_id = ?`)
      params.push(userId)
    }

    updates.push(`updated_at = ?`)
    params.push(now)
    params.push(token)

    return await runSql(`UPDATE proxies SET ${updates.join(', ')} WHERE token = ?`, params)
  }

  static async delete(token) {
    return await runSql('DELETE FROM proxies WHERE token = ?', [token])
  }

  static async markAsExpired(token) {
    return await runSql("UPDATE proxies SET status = 'expired', updated_at = ? WHERE token = ?", [Date.now(), token])
  }

  static async extend(token, additionalTime) {
    const now = Date.now()
    const proxy = await queryOne('SELECT expire_time FROM proxies WHERE token = ?', [token])
    if (proxy) {
      const newExpireTime = proxy.expire_time + additionalTime
      return await runSql('UPDATE proxies SET expire_time = ?, status = ?, updated_at = ? WHERE token = ?', [newExpireTime, 'active', now, token])
    }
    return null
  }

  static async cleanupExpired() {
    const now = Date.now()
    const expired = await queryAll('SELECT * FROM proxies WHERE expire_time <= ?', [now])
    
    await runSql('DELETE FROM proxies WHERE expire_time <= ?', [now])

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
