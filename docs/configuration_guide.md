# 配置指南

## 快速配置

将 `conf.yaml.example` 文件复制为 `conf.yaml`，并根据您的具体设置和需求修改配置。

```bash
cd deer-flow-cn
cp conf.yaml.example conf.yaml
```

## DeerFlow 支持哪些模型？

在 DeerFlow 中，目前我们只支持非推理模型，这意味着像 OpenAI 的 o1/o3 或 DeepSeek 的 R1 等推理模型暂不支持，但我们将在未来添加对它们的支持。

### 支持的模型

`doubao-1.5-pro-32k-250115`、`gpt-4o`、`qwen-max-latest`、`gemini-2.0-flash`、`deepseek-v3`，以及理论上任何其他实现 OpenAI API 规范的非推理聊天模型。

> [!NOTE]
> 深度研究过程需要模型具有**更长的上下文窗口**，并非所有模型都支持。
> 解决方法是在网页右上角的设置对话框中将 `研究计划最大步数` 设置为 `2`，
> 或在调用 API 时将 `max_step_num` 设置为 `2`。

### 如何切换模型？
您可以通过修改项目根目录中的 `conf.yaml` 文件来切换使用的模型，使用 [litellm 格式](https://docs.litellm.ai/docs/providers/openai_compatible) 的配置。

---

### 如何使用 OpenAI 兼容模型？

DeerFlow 支持与 OpenAI 兼容模型集成，这些模型实现了 OpenAI API 规范。包括各种提供与 OpenAI 格式兼容的 API 端点的开源和商业模型。您可以参考 [litellm OpenAI-Compatible](https://docs.litellm.ai/docs/providers/openai_compatible) 获取详细文档。
以下是使用 OpenAI 兼容模型的 `conf.yaml` 配置示例：

```yaml
# 火山引擎豆包模型示例
BASIC_MODEL:
  base_url: "https://ark.cn-beijing.volces.com/api/v3"
  model: "doubao-1.5-pro-32k-250115"
  api_key: YOUR_API_KEY

# 阿里云模型示例
BASIC_MODEL:
  base_url: "https://dashscope.aliyuncs.com/compatible-mode/v1"
  model: "qwen-max-latest"
  api_key: YOUR_API_KEY

# DeepSeek 官方模型示例
BASIC_MODEL:
  base_url: "https://api.deepseek.com"
  model: "deepseek-chat"
  api_key: YOU_API_KEY

# Google Gemini 模型使用 OpenAI 兼容接口示例
BASIC_MODEL:
  base_url: "https://generativelanguage.googleapis.com/v1beta/openai/"
  model: "gemini-2.0-flash"
  api_key: YOUR_API_KEY
```

### 如何使用 Ollama 模型？

DeerFlow 支持与 Ollama 模型集成。您可以参考 [litellm Ollama](https://docs.litellm.ai/docs/providers/ollama) 获取详细文档。<br>
以下是使用 Ollama 模型的 `conf.yaml` 配置示例：

```yaml
BASIC_MODEL:
  model: "ollama/ollama-model-name"
  base_url: "http://localhost:11434" # Ollama 本地服务地址，可通过 ollama serve 启动/查看
```

### 如何使用 OpenRouter 模型？

DeerFlow 支持与 OpenRouter 模型集成。您可以参考 [litellm OpenRouter](https://docs.litellm.ai/docs/providers/openrouter) 获取详细文档。要使用 OpenRouter 模型，您需要：
1. 从 OpenRouter (https://openrouter.ai/) 获取 OPENROUTER_API_KEY 并在环境变量中设置。
2. 在模型名称前添加 `openrouter/` 前缀。
3. 配置正确的 OpenRouter 基础 URL。

以下是使用 OpenRouter 模型的配置示例：
1. 在环境变量中配置 OPENROUTER_API_KEY（如 `.env` 文件）
```ini
OPENROUTER_API_KEY=""
```
2. 在 `conf.yaml` 中设置模型名称
```yaml
BASIC_MODEL:
  model: "openrouter/google/palm-2-chat-bison"
```

注意：可用的模型及其确切名称可能会随时间变化。请在 [OpenRouter 官方文档](https://openrouter.ai/docs) 中验证当前可用的模型及其正确标识符。

### 如何使用 Azure 模型？

DeerFlow 支持与 Azure 模型集成。您可以参考 [litellm Azure](https://docs.litellm.ai/docs/providers/azure) 获取详细文档。`conf.yaml` 配置示例：
```yaml
BASIC_MODEL:
  model: "azure/gpt-4o-2024-08-06"
  api_base: $AZURE_API_BASE
  api_version: $AZURE_API_VERSION
  api_key: $AZURE_API_KEY
```
