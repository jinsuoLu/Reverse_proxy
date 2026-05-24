# Reverse Proxy Management System

> 一个基于 Vue + Express + SQLite 的反向代理管理系统

## 📋 功能特性

- ✅ **授权管理** - 管理 API 授权列表
- ✅ **用户管理** - 用户信息管理模块
- ✅ **代理链接** - 生成和管理代理链接
- ✅ **数据持久化** - 使用 SQLite 存储数据
- ✅ **一键部署** - 支持 Render 平台自动部署

## 🛠️ 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Vue | 2.7 |
| UI 组件 | Element UI | - |
| 构建工具 | Rspack | - |
| 后端框架 | Express | ^4.18 |
| 数据库 | SQLite | ^5.0 |
| 加密库 | crypto | Node.js |

## 📁 项目结构

```
├── src/                    # 前端源码
│   ├── views/              # 页面组件
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理
│   ├── utils/              # 工具函数
│   ├── api/                # API 接口
│   └── config/             # 配置文件
├── server/                 # 后端服务
│   ├── index.js            # 服务入口
│   ├── database.js         # 数据库连接
│   └── models/             # 数据模型
├── data/                   # SQLite 数据库文件
├── dist/                   # 前端构建产物
├── render.yaml             # Render 部署配置
└── package.json            # 项目依赖
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
npm install --prefix server
```

### 开发模式

```bash
# 启动前端开发服务器 (端口 8090)
npm run serve:rspack

# 启动后端服务器 (端口 3001)
cd server && node index.js
```

### 生产构建

```bash
# 构建前端
npm run build

# 启动生产服务器
cd server && node index.js
```

### 访问地址

- 前端开发：http://localhost:8090
- 后端 API：http://localhost:3001
- 生产环境：http://localhost:3001

## 📦 部署到 Render

### 一键部署

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### 手动部署

1. **访问 Render**：https://dashboard.render.com/

2. **创建 Web Service**：
   - 点击 "New +" → "Web Service"
   - 连接 GitHub 仓库：`https://github.com/jinsuoLu/Reverse_proxy`

3. **配置服务**：
   - **Name**: `reverse-proxy` (或您喜欢的名字)
   - **Region**: `Singapore` (亚洲节点最快)
   - **Branch**: `main`
   - **Root Directory**: (留空)
   - **Runtime**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: `Free`

4. **环境变量 (Env Vars)**：
   | Key | Value |
   |-----|-------|
   | NODE_ENV | production |

5. **点击 "Create Web Service"**

### 部署完成

访问地址类似：`https://reverse-proxy.onrender.com`

**登录账户**：
- 用户名：`admin`
- 密码：`123456`

---

## 🔧 Render 部署故障排除

### 问题 1：依赖安装失败 (ERESOLVE)
**解决方法**：确保使用 `--legacy-peer-deps` 标志
- Build Command: `npm install --legacy-peer-deps && npm run build`

### 问题 2：构建超时
**解决方法**：
- 确保使用免费计划
- 检查 Node.js 版本兼容性 (使用 18 或 20)
- 我们的项目已配置 `.npmrc` 文件自动处理

### 问题 3：构建成功但无法启动
**检查清单**：
1. 查看 "Logs" 标签页
2. 确认 `dist` 目录已生成
3. 检查端口配置 (应使用 `process.env.PORT`)

### 完整的部署配置示例
使用项目中的 `render.yaml` 可自动配置所有参数！

---

## 💡 Render 免费版说明

- 15 分钟无流量后会自动休眠
- 首次访问需要 30 秒左右唤醒
- 完全免费，适合测试和小规模使用
- SQLite 数据会在实例重启时保留（只要不重新部署）

## 🔌 API 接口

### 授权管理

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/proxy/create` | 创建授权 |
| GET | `/api/proxy/list` | 获取授权列表 |
| GET | `/api/proxy/:id` | 获取单个授权 |
| PUT | `/api/proxy/:id` | 更新授权 |
| DELETE | `/api/proxy/:id` | 删除授权 |

### 用户管理

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/user/list` | 获取用户列表 |

### 健康检查

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |

## 🔒 安全说明

- 使用 RSA 加密传输敏感数据
- CORS 跨域配置限制
- 生产环境日志脱敏

## 📝 更新日志

### v1.0.0
- 初始化项目
- 实现授权管理功能
- 实现用户管理模块
- 添加 Render 部署支持

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**项目维护**: [jinsuoLu](https://github.com/jinsuoLu)

⭐ 如果这个项目对您有帮助，请给个 Star！
