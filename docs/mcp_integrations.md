# MCP 集成

## MCP 服务器配置示例

```json
{
  "mcpServers": {
    "mcp-github-trending": {
      "transport": "stdio",
      "command": "uvx",
      "args": [
          "mcp-github-trending"
      ]
    }
  }
}
```

## API 接口

### 获取 MCP 服务器元数据

**POST /api/mcp/server/metadata**

对于 `stdio` 类型：
```json
{
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "tavily-mcp@0.1.3"],
  "env": {"TAVILY_API_KEY":  "tvly-dev-xxx"}
}
```

对于 `sse` 类型：
```json
{
  "transport": "sse",
  "url": "http://localhost:3000/sse",
  "env": {
    "API_KEY": "value"
  }
}
```

### 聊天流

**POST /api/chat/stream**

```json
{
  ...
  "mcp_settings": {
    "servers": {
      "mcp-github-trending": {
        "transport": "stdio",
        "command": "uvx",
        "args": ["mcp-github-trending"],
        "env": {
          "MCP_SERVER_ID": "mcp-github-trending"
        },
        "enabled_tools": ["get_github_trending_repositories"],
        "add_to_agents": ["researcher"]
      }
    }
  },
}
```
