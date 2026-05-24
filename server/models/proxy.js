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

function getLastInsertRowid() {
  const db = getDatabase()
  if (!db) return null
  
  try {
    const result = db.exec('SELECT last_insert_rowid() as id')
    if (result.length > 0 && result[0].values.length > 0) {
      return result[0].values[0][0]
    }
    return null
  } catch (err) {
    console.error('Get last insert rowid error:', err)
    return null
  }
}

class ProxyModel {
  static getAll() {
    return queryAll('SELECT * FROM proxies ORDER BY created_at DESC')
  }

  static getByToken(token) {
    return queryOne('SELECT * FROM proxies WHERE token = ?', [token])
  }

  static getActive() {
    const now = Date.now()
    return queryAll('SELECT * FROM proxies WHERE expire_time > ? AND status = ? ORDER BY created_at DESC', [now, 'active'])
  }

  static getExpired() {
    const now = Date.now()
    return queryAll('SELECT * FROM proxies WHERE expire_time <= ? OR status = ? ORDER BY created_at DESC', [now, 'expired'])
  }

  static create(proxyData) {
    const { token, phone, targetUrl, expireTime, captchaCode, captchaTime, imageBase64, userId } = proxyData
    const now = Date.now()

    runSql(`
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

    return { id: getLastInsertRowid(), ...proxyData, created_at: now, updated_at: now }
  }

  static update(token, proxyData) {
    const { phone, targetUrl, expireTime, captchaCode, captchaTime, imageBase64, status, userId } = proxyData
    const now = Date.now()

    const updates = []
    const params = []

    if (phone !== undefined) {
      updates.push('phone = ?')
      params.push(phone)
    }
    if (targetUrl !== undefined) {
      updates.push('target_url = ?')
      params.push(targetUrl)
    }
    if (expireTime !== undefined) {
      updates.push('expire_time = ?')
      params.push(expireTime)
    }
    if (captchaCode !== undefined) {
      updates.push('captcha_code = ?')
      params.push(captchaCode)
    }
    if (captchaTime !== undefined) {
      updates.push('captcha_time = ?')
      params.push(captchaTime)
    }
    if (imageBase64 !== undefined) {
      updates.push('image_base64 = ?')
      params.push(imageBase64)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      params.push(status)
    }
    if (userId !== undefined) {
      updates.push('user_id = ?')
      params.push(userId)
    }

    updates.push('updated_at = ?')
    params.push(now)
    params.push(token)

    return runSql(`UPDATE proxies SET ${updates.join(', ')} WHERE token = ?`, params)
  }

  static delete(token) {
    return runSql('DELETE FROM proxies WHERE token = ?', [token])
  }

  static markAsExpired(token) {
    return runSql("UPDATE proxies SET status = 'expired', updated_at = ? WHERE token = ?", [Date.now(), token])
  }

  static extend(token, additionalTime) {
    const now = Date.now()
    const proxy = queryOne('SELECT expire_time FROM proxies WHERE token = ?', [token])
    if (proxy) {
      const newExpireTime = proxy.expire_time + additionalTime
      return runSql('UPDATE proxies SET expire_time = ?, status = ?, updated_at = ? WHERE token = ?', [newExpireTime, 'active', now, token])
    }
    return null
  }

  static cleanupExpired() {
    const now = Date.now()
    const expired = queryAll('SELECT * FROM proxies WHERE expire_time <= ?', [now])
    
    runSql('DELETE FROM proxies WHERE expire_time <= ?', [now])
    runSql("UPDATE proxies SET status = 'expired' WHERE expire_time <= ?", [now])

    return expired.length
  }

  static getStats() {
    const now = Date.now()
    const allProxies = queryAll('SELECT * FROM proxies')
    const total = allProxies.length
    const active = allProxies.filter(p => p.expire_time > now && p.status === 'active').length
    const expired = total - active

    return { total, active, expired }
  }
}

module.exports = ProxyModel
