FROM docker.m.daocloud.io/library/node:20-slim

# better-sqlite3 原生模块的兜底编译工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 用 pnpm 安装（绕开 npm 处理 file: 依赖的 bug）
RUN npm install -g pnpm@9 --registry=https://registry.npmmirror.com

COPY . .

# 安装依赖 → 重建 better-sqlite3 原生模块（容器内 GLIBC 新，预编译包可用）→ 构建前端
RUN pnpm install --no-frozen-lockfile --registry=https://registry.npmmirror.com \
 && pnpm rebuild better-sqlite3 \
 && pnpm run build

ENV NODE_ENV=production
ENV PORT=3001
ENV SQLITE_DB_PATH=/app/data/database.db

EXPOSE 3001

CMD ["node", "server/index.js"]
