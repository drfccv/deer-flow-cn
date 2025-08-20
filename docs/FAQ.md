# 常见问题 FAQ

## 目录

- [DeerFlow 这个名字的由来？](#deerflow-这个名字的由来)
- [DeerFlow 支持哪些模型？](#deerflow-支持哪些模型)
- [如何解决模型配置问题？](#如何解决模型配置问题)
- [为什么研究结果不够详细？](#为什么研究结果不够详细)
- [如何提升搜索质量？](#如何提升搜索质量)
- [Docker 部署常见问题](#docker-部署常见问题)

## DeerFlow 这个名字的由来？

DeerFlow 是 **D**eep **E**xploration and **E**fficient **R**esearch **Flow**（深度探索与高效研究流程）的缩写。它以鹿为象征，代表着温和与优雅。我们希望 DeerFlow 能为您带来温和而优雅的深度研究体验。

## DeerFlow 支持哪些模型？

请参考 [配置指南](configuration_guide.md) 获取详细信息。

## 如何解决模型配置问题？

### API 密钥配置错误
- 检查 `.env` 文件中的 API 密钥是否正确
- 确认 API 密钥有足够的配额和权限
- 验证 `conf.yaml` 中的模型名称和 base_url 是否匹配

### 模型响应超时
- 检查网络连接是否稳定
- 尝试切换到响应更快的模型
- 调整请求超时设置

## 为什么研究结果不够详细？

### 可能的原因和解决方案：

1. **上下文窗口限制**
   - 使用支持更长上下文的模型（如 GPT-4、Claude-3 等）
   - 在设置中将 "研究计划最大步数" 调整为 2

2. **搜索源配置不当**
   - 确保配置了有效的搜索 API（Tavily、SearXNG 等）
   - 检查搜索 API 的配额和权限

3. **查询描述不够具体**
   - 提供更详细和具体的研究问题
   - 使用关键词和专业术语

## 如何提升搜索质量？

### 推荐配置：

1. **启用多个搜索源**
   ```bash
   # 安装 SearXNG（推荐）
   bash ./src/tools/install-searxng.sh
   ```

2. **配置高质量搜索 API**
   - Tavily API：专为 AI 优化的搜索
   - Brave Search：独立搜索引擎
   - SearXNG：隐私友好的聚合搜索

3. **优化搜索查询**
   - 使用具体的关键词
   - 包含时间范围（如 "2024年"）
   - 指定语言和地区

## Docker 部署常见问题

### 容器启动失败
```bash
# 检查容器日志
docker logs deerflow-cn

# 确保配置文件已正确挂载
docker run -v $(pwd)/.env:/app/.env -v $(pwd)/conf.yaml:/app/conf.yaml ...
```

### 端口冲突
```bash
# 修改端口映射
docker run -p 3001:3000 -p 8001:8000 ...
```

### 配置文件权限问题
```bash
# 确保配置文件可读
chmod 644 .env conf.yaml
```

---

💡 **提示**：如果遇到其他问题，请查看项目的 [GitHub Issues](https://github.com/drfccv/deer-flow-cn/issues) 或提交新的问题报告。
