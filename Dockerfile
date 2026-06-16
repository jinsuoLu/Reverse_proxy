FROM node:20-slim

# better-sqlite3 はネイティブモジュールなのでビルドツールが必要
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ソースをコピー（layouts / vab-icon のローカル依存も含めるため全部コピー）
COPY . .

# 依存インストール → フロントエンド(dist)をビルド
RUN npm install --legacy-peer-deps \
 && npm run build \
 && npm cache clean --force

ENV NODE_ENV=production
ENV PORT=3001
# SQLite の保存先（compose でボリュームマウントする）
ENV SQLITE_DB_PATH=/app/data/database.db

EXPOSE 3001

CMD ["node", "server/index.js"]
