// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { Settings, type LucideIcon } from "lucide-react";

import { AboutTab } from "./about-tab";
import { GeneralTab } from "./general-tab";
import { MCPTab } from "./mcp-tab";

export const SETTINGS_TABS = [GeneralTab, MCPTab, AboutTab].map((tab) => {
  const name = tab.name ?? tab.displayName;
  // 中文标签映射
  const labelMap: Record<string, string> = {
    general: "通用设置",
    mcp: "MCP 服务器",
    about: "关于",
  };
  const id = name.replace(/Tab$/, "").toLocaleLowerCase();
  return {
    ...tab,
    id,
    label: labelMap[id] ? labelMap[id] : id,
    icon: (tab.icon ?? <Settings />) as LucideIcon,
    component: tab,
  };
});
