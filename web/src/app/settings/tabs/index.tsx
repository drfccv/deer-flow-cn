// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { Settings } from "lucide-react";

import { AboutTab } from "./about-tab";
import { GeneralTab } from "./general-tab";
import { MCPTab } from "./mcp-tab";
import { PromptTab } from "./prompt-tab";

export const SETTINGS_TABS = [GeneralTab, MCPTab, PromptTab, AboutTab].map((tab) => {
  // 优先 tabId，其次 name，再次 displayName
  const name = tab.tabId ?? tab.name ?? tab.displayName;
  const labelMap: Record<string, string> = {
    general: "通用设置",
    mcp: "MCP 服务器",
    "prompt-preset": "提示词",
    about: "关于",
  };
  let id = typeof name === "string" ? name.replace(/Tab$/i, "").toLocaleLowerCase() : "";
  if (!labelMap[id] && typeof tab.displayName === "string" && /[\u4e00-\u9fa5]/.test(tab.displayName)) {
    id = Object.keys(labelMap).find(k => labelMap[k] === tab.displayName) ?? id;
  }
  return {
    ...tab,
    id,
    label: labelMap[id] ?? (typeof tab.displayName === "string" ? tab.displayName : id),
    icon: tab.icon ?? Settings,
    tabId: tab.tabId,
    badge: tab.badge,
    displayName: tab.displayName,
    // 关键：保留原始组件引用
    component: tab,
  };
});
