<div align="center">

# 🦌 DeerFlow-CN

**智能深度研究与信息检索 AI 助手**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.12+-green.svg)](https://python.org)
[![Node.js](https://img.shields.io/badge/node.js-22+-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://docker.com)

🌐 [在线 Demo 体验](https://ai.liuyuan.top) | 📖 [配置指南](docs/configuration_guide.md) | 🤔 [常见问题](docs/FAQ.md)

</div>

## 📖 项目简介

DeerFlow-CN 是基于 [bytedance/deer-flow](https://github.com/bytedance/deer-flow) 深度优化的智能研究助手，专为中文用户打造。它结合了先进的大语言模型与多种外部工具，为学术研究、科研分析、知识管理等场景提供强大支持。

### ✨ 核心优势

- 🎯 **智能研究**：基于 LangGraph 的多智能体协作，提供深度分析能力
- 🔍 **多源检索**：集成 Tavily、SearXNG、Brave Search 等多个搜索引擎
- 📊 **多格式输出**：支持生成研究报告、PPT、播客等多种格式
- 🇨🇳 **中文优化**：全面汉化界面，优化中文语言模型支持
- 📱 **响应式设计**：完美适配桌面、平板、手机等多种设备

---

## 🛠️ 技术栈

### 后端技术
- **Python 3.12+** - 核心运行环境
- **FastAPI** - 高性能 Web 框架
- **LangGraph** - 多智能体工作流编排
- **LangChain** - LLM 应用开发框架
- **LiteLLM** - 统一 LLM API 接口

### 前端技术
- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Radix UI** - 无障碍组件库

### 开发工具
- **uv** - 现代 Python 包管理器
- **pnpm** - 高效的 Node.js 包管理器
- **Docker** - 容器化部署

## 📋 环境要求

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| Python | 3.12+ | 后端运行环境 |
| Node.js | 22+ | 前端构建环境 |
| uv | 最新版 | Python 包管理（推荐） |
| pnpm | 最新版 | Node.js 包管理（推荐） |

---

## 🚀 功能特性

### 🎯 智能研究能力
- **多智能体协作**：基于 LangGraph 的智能体工作流，包含研究员、规划师、协调员等角色
- **深度信息检索**：整合多个搜索引擎，提供全面的信息收集能力
- **多格式输出**：支持生成研究报告、PPT 演示文稿、播客音频等多种格式
- **自定义 Prompt**：支持用户自定义提示词，灵活适配不同研究场景

### 🇨🇳 中文优化体验
- **全面汉化**：界面、交互、设置、提示等完全中文化
- **中文模型优化**：针对中文语言模型进行特别优化
- **本地化增强**：适配中文用户的使用习惯和需求

### 🔍 多源搜索集成
- **Tavily Search**：专业的 AI 搜索 API
- **SearXNG 集成**：隐私友好的开源搜索引擎
- **Brave Search**：独立的搜索引擎 API
- **一键 SearXNG 部署**：内置脚本自动安装和配置

### 📱 现代化界面
- **响应式设计**：完美适配桌面、平板、手机等设备
- **多分辨率支持**：支持 4K、竖屏等多种显示模式
- **Chat 模式**：支持简单聊天模式，可选择性调用研究功能
- **优化交互**：修复界面异常，提升用户体验

### 🔒 部署与安全
- **一键启动**：提供 `start.js` 和 `start-with-searxng.js` 启动脚本
- **SSL 支持**：内置 HTTPS 支持，自动加载 SSL 证书
- **Docker 部署**：支持容器化部署，简化运维
- **环境隔离**：使用 uv 管理 Python 环境，避免依赖冲突

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

## 🚀 快速开始

### 一键启动

```bash
# 1. 克隆项目
git clone https://github.com/drfccv/deer-flow-cn.git
cd deer-flow-cn

# 2. 安装后端依赖
uv sync

# 3. 配置环境变量
# 后端配置
cp .env.example .env
cp conf.yaml.example conf.yaml
# 编辑 .env 和 conf.yaml 文件，配置 API 密钥和模型

# 前端配置
cp web/.env.example web/.env
# 编辑 web/.env 文件，配置前端 API 地址（默认：NEXT_PUBLIC_API_URL=http://localhost:8000/api）

# 4. 安装前端依赖
cd web && pnpm install && cd ..

# 5. 一键启动（包含 SearXNG）
bash ./src/tools/install-searxng.sh
node start-with-searxng.js

# 6. 一键启动（不包含 SearXNG）
node start.js

# 7. SSL 配置（可选）
# 后端 HTTPS：编辑 start.js 或 start-with-searxng.js 文件
# 取消 SSL 证书参数的注释并配置正确的证书路径

# 前端 HTTPS：建议使用反向代理（如 Nginx）处理前端 SSL
# 开发环境可使用：cd web && npx next dev --experimental-https

访问 `http://localhost:3000` 开始使用！（如启用前端SSL则访问 `https://localhost:3000`）

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

## 🐳 Docker 部署

### 快速启动

```bash
# 1. 拉取镜像
docker pull drfccv/deerflow-cn:latest

# 2. 准备配置文件
cp .env.example .env
cp conf.yaml.example conf.yaml
# 编辑配置文件

# 3. 启动容器
docker run -d \
  --name deerflow-cn \
  -p 3000:3000 \
  -p 8000:8000 \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/conf.yaml:/app/conf.yaml \
  drfccv/deerflow-cn:latest
```

### Windows PowerShell

```powershell
docker run -d `
  --name deerflow-cn `
  -p 3000:3000 `
  -p 8000:8000 `
  -v ${PWD}\.env:/app/.env `
  -v ${PWD}\conf.yaml:/app/conf.yaml `
  drfccv/deerflow-cn:latest
```

### Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  deerflow-cn:
    image: drfccv/deerflow-cn:latest
    container_name: deerflow-cn
    ports:
      - "3000:3000"
      - "8000:8000"
    volumes:
      - ./.env:/app/.env
      - ./conf.yaml:/app/conf.yaml
    restart: unless-stopped
```

启动：
```bash
docker-compose up -d
```

### 访问地址

- 🌐 **前端界面**：http://localhost:3000
- 🔌 **后端 API**：http://localhost:8000
- 📚 **API 文档**：http://localhost:8000/docs

## 📖 使用指南

### 基本使用流程

1. **配置模型**：在设置页面配置 LLM 模型和 API 密钥
2. **选择模式**：
   - **研究模式**：深度分析和信息检索
   - **聊天模式**：简单对话交互
3. **输入查询**：描述你的研究需求或问题
4. **查看结果**：获得详细的研究报告、PPT 或播客

### 支持的输出格式

| 格式 | 描述 | 适用场景 |
|------|------|----------|
| 📄 **研究报告** | 详细的文本分析报告 | 学术研究、市场分析 |
| 📊 **PPT 演示** | 可视化演示文稿 | 会议汇报、教学展示 |
| 🎧 **播客音频** | 语音形式的内容 | 移动收听、多媒体分享 |
| 💬 **对话交流** | 实时问答互动 | 快速咨询、头脑风暴 |

### 配置说明

详细的配置指南请参考：
- 📖 [配置指南](docs/configuration_guide.md)
- 🤔 [常见问题](docs/FAQ.md)
- 🔌 [MCP 集成](docs/mcp_integrations.md)

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork 项目**到你的 GitHub 账户
2. **创建功能分支**：`git checkout -b feature/amazing-feature`
3. **提交更改**：`git commit -m 'Add some amazing feature'`
4. **推送分支**：`git push origin feature/amazing-feature`
5. **创建 Pull Request**

### 贡献类型

- 🐛 **Bug 修复**：修复现有问题
- ✨ **新功能**：添加新的功能特性
- 📚 **文档改进**：完善文档和示例
- 🌐 **国际化**：添加多语言支持
- 🎨 **UI/UX 优化**：改进用户界面和体验
- ⚡ **性能优化**：提升系统性能

### 开发规范

- 遵循现有的代码风格
- 添加适当的测试用例
- 更新相关文档
- 确保所有测试通过

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

### 核心项目
- **[bytedance/deer-flow](https://github.com/bytedance/deer-flow)** - 原始项目基础
- **[LangChain](https://github.com/langchain-ai/langchain)** - LLM 应用开发框架
- **[LangGraph](https://github.com/langchain-ai/langgraph)** - 多智能体工作流

### 技术栈
- **[Next.js](https://nextjs.org/)** - React 全栈框架
- **[FastAPI](https://fastapi.tiangolo.com/)** - 现代 Python Web 框架
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[Radix UI](https://www.radix-ui.com/)** - 无障碍组件库

### 外部服务
- **[SearXNG](https://github.com/searxng/searxng)** - 隐私友好的搜索引擎
- **[Marp](https://github.com/marp-team/marp-cli)** - Markdown 演示文稿工具
- **[Tavily](https://tavily.com/)** - AI 搜索 API

### 社区贡献者

感谢所有为项目做出贡献的开发者们！

---

<div align="center">

**如有问题或建议，欢迎：**

📖 [查阅文档](docs/) | 🐛 [提交 Issue](../../issues) | 💬 [参与讨论](../../discussions)

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！**

</div>
