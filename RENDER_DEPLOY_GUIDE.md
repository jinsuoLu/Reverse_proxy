# Render 部署包

这是一个专门为 Render 平台准备的部署包。

## 📦 包含内容

- ✅ 预构建的前端 (`dist/`)
- ✅ 后端服务器 (`server/`)
- ✅ 所有必要的依赖已配置

## 🚀 部署步骤

### 方式一：使用 render.yaml（推荐）

1. 将整个项目推送到 GitHub
2. 在 Render 创建新服务，连接到 GitHub 仓库
3. Render 会自动使用 `render.yaml` 配置

### 方式二：手动部署

在 Render 控制台配置：

- **Name**: `reverse-proxy`
- **Region**: `Singapore`
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install --legacy-peer-deps`
- **Start Command**: `node server/index.js`
- **Instance Type**: `Free`

**环境变量**:
- `NODE_ENV` = `production`

## 📋 重要说明

1. **数据库**: 使用 SQLite (sql.js)，数据存储在 `/data/app.db`
2. **首次部署**: 会在 `/data` 目录自动创建数据库
3. **数据持久化**: 
   - 免费实例重启后会丢失数据
   - 如果需要持久化，考虑升级到付费实例或使用外部数据库

## 🔧 本地构建步骤

如果需要在本地构建并测试：

```bash
# 安装依赖
npm install --legacy-peer-deps

# 构建前端
npm run build

# 启动服务器
cd server
npm install
cd ..
node server/index.js
```

## 🌐 访问应用

部署成功后，访问：`https://your-service-name.onrender.com`

**默认登录账户**:
- 用户名: `admin`
- 密码: `123456`

## ⚠️ 限制

- 免费套餐：实例会在 15 分钟无流量后休眠
- 首次访问需要 30 秒左右唤醒
- SQLite 数据库在实例重启后会重置

## 🔄 更新部署

推送新代码到 GitHub 后，Render 会自动重新部署。
