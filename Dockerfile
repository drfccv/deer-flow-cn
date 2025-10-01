# 基于官方 Python 镜像构建后端

FROM python:3.12-slim AS backend
WORKDIR /app
# 安装系统依赖
RUN apt-get update && apt-get install -y git build-essential ffmpeg && rm -rf /var/lib/apt/lists/*
# 复制依赖文件和代码
COPY pyproject.toml uv.lock ./
COPY conf.yaml.example conf.yaml
COPY .env.example .env
COPY src ./src
COPY main.py server.py ./
COPY assets ./assets
COPY README.md ./README.md
# 先全局安装 uv，再直接同步依赖
RUN pip install uv && uv sync

# 基于官方 Node 镜像构建前端
FROM node:22-slim AS frontend
WORKDIR /web
COPY web/package.json web/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY web/ ./
RUN pnpm build

# 生产环境镜像
FROM python:3.12-slim
WORKDIR /app
# 安装系统依赖和 Node.js（用于运行 Next.js）
RUN apt-get update && apt-get install -y ffmpeg curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm && \
    rm -rf /var/lib/apt/lists/*
# 复制后端
COPY --from=backend /app /app
# 复制前端构建产物和依赖
COPY --from=frontend /web/.next ./web/.next
COPY --from=frontend /web/public ./web/public
COPY --from=frontend /web/src ./web/src
COPY --from=frontend /web/package.json ./web/package.json
COPY --from=frontend /web/pnpm-lock.yaml ./web/pnpm-lock.yaml
COPY --from=frontend /web/next.config.js ./web/next.config.js
# 安装前端生产依赖
RUN cd web && pnpm install --prod --frozen-lockfile
# 安装后端运行依赖
RUN pip install uv
# 复制启动脚本
COPY start.js ./
# 暴露端口
EXPOSE 8000 3000
# 启动命令 - 使用 node start.js 启动（生产模式）
CMD ["node", "start.js"]
