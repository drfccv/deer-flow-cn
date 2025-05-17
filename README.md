# DeerFlow-CN

> 本项目基于 [bytedance/deer-flow](https://github.com/bytedance/deer-flow) 二次开发，专为中文用户优化，支持一键部署、SearXNG 集成、SSL 证书等。

🌐 [在线 Demo 体验](https://ai.liuyuan.top)

## 项目简介

DeerFlow-CN 是一款面向深度研究与高效信息检索的 AI 工具，结合大语言模型与多种外部工具，适用于学术、科研、知识管理等场景。相比原版，DeerFlow-CN 提供了更好的中文体验、屏幕适配与本地化增强。

---

## 环境要求

- 🟢 Node.js 22 及以上
- 🐍 Python 3.12 及以上

### 推荐工具

- ⚡ **uv**：简化 Python 环境与依赖管理，自动创建虚拟环境并安装依赖，无需手动配置 Python 环境。
- 🔄 **nvm**：高效管理多版本 Node.js 运行时。
- 🚀 **pnpm**：高效安装和管理 Node.js 项目依赖。

---

## 主要特点

- 🇨🇳 **全面汉化**：界面、交互、设置、提示等全部中文化。
- 📱 **屏幕自适应**：支持移动端、4K、竖屏等多种分辨率，体验更佳。
- 💬 **Chat 简单聊天模式**：可选择不调用 researcher，仅用 LLM 聊天。
- 🛠️ **Settings 界面优化**：修复 Tab 显示异常，交互更流畅。
- 🔍 **SearXNG 集成**：支持 SearXNG 作为搜索来源，隐私友好。
- 🧩 **一键安装/启动 SearXNG**：内置脚本自动安装并集成 SearXNG。
- ⚡ **一键启动脚本**：`start.js`/`start-with-searxng.js` 支持 SSL，证书自动加载。
- 🔒 **SSL 支持**：可直接部署 HTTPS，证书与密钥位于 `web/fullchain.pem`、`web/privkey.pem`。

---

## 项目架构

```
├── main.py / server.py         # 后端主入口
├── src/                       # 核心后端逻辑（agents/、llms/、tools/等）
├── web/                       # 前端 Next.js + Tailwind + React
│   ├── src/app/               # 页面与组件
│   ├── public/                # 静态资源
│   ├── start.js               # 一键启动脚本（支持SSL）
│   ├── start-with-searxng.js  # 启动并集成SearXNG
│   ├── fullchain.pem          # SSL证书
│   ├── privkey.pem            # SSL密钥
│   └── ...
├── conf.yaml                  # LLM与API配置
├── .env                       # API密钥配置
├── docs/                      # 配置与使用文档
└── ...
```

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/drfccv/deer-flow-cn.git
cd deer-flow-cn
```

### 2. 安装依赖

```bash
uv sync
```

### 3. 配置环境变量

- 复制并编辑 `.env`：
  ```bash
  cp .env.example .env
  # 配置 Tavily、Brave Search、volcengine TTS 等 API Key
  ```
- 复制并编辑 `conf.yaml`：
  ```bash
  cp conf.yaml.example conf.yaml
  # 配置 LLM 接口与模型
  ```
- 详细配置说明见 `docs/configuration_guide.md`

### 4. 安装 Marp（PPT 生成）（可选）

- [marp-cli 安装文档](https://github.com/marp-team/marp-cli?tab=readme-ov-file#use-package-manager)
- macOS: `brew install marp-cli`

### 5. 安装 SearXNG（可选，推荐）

```bash
bash ./src/tools/install-searxng.sh
```

### 6. 安装前端依赖

```bash
cd web
pnpm install
```

### 7. 一键启动（推荐，自动启用SSL）

- 启动后端+前端+SearXNG（推荐）：
  ```bash
  node start-with-searxng.js
  ```
- 仅启动后端+前端（不含SearXNG）：
  ```bash
  node start.js
  ```
- 默认自动加载 `web/fullchain.pem`、`web/privkey.pem` 证书。

### 8. 开发模式

- 启动前端：
  ```bash
  pnpm dev
  ```
- 启动后端：
  ```bash
  uv run server.py --ssl --ssl-certfile=web/fullchain.pem --ssl-keyfile=web/privkey.pem
  ```
  > 可省略 --ssl 参数则为 HTTP，添加 --ssl 参数即启用 HTTPS。

---

## 主要配置说明

- `.env`：API 密钥（Tavily、Brave、TTS等）
- `conf.yaml`：LLM模型与API配置，详见 `docs/configuration_guide.md`
- `web/fullchain.pem`、`web/privkey.pem`：SSL证书与密钥

---

## 主要改进与亮点

- 全面汉化，适合中文用户
- 响应式设计，适配多终端
- Chat支持“简单聊天”模式
- Settings界面Tab显示修复
- SearXNG一键集成与自动安装
- 一键SSL部署，安全易用

---

## 参考与致谢

- 原项目：[bytedance/deer-flow](https://github.com/bytedance/deer-flow)
- SearXNG: https://github.com/searxng/searxng
- Marp: https://github.com/marp-team/marp-cli

---

如有问题请查阅 `docs/FAQ.md` 或提交 issue。
