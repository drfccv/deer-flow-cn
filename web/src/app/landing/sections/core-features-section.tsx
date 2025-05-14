// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { Bird, Microscope, Podcast, Usb, User } from "lucide-react";

import { BentoCard, BentoGrid } from "~/components/magicui/bento-grid";

import { SectionHeader } from "../components/section-header";

const features = [
  {
    Icon: Microscope,
    name: "更深入、更广阔",
    description:
      "利用高级工具解锁更深层洞察。强大的搜索+爬取与Python工具，助您收集全面数据，生成深度报告，提升研究质量。",
    href: "https://github.com/bytedance/deer-flow/blob/main/src/tools",
    cta: "了解更多",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: User,
    name: "人在环中",
    description:
      "通过自然语言即可优化研究计划或调整关注重点。",
    href: "https://github.com/bytedance/deer-flow/blob/main/src/graph/nodes.py",
    cta: "了解更多",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Bird,
    name: "Lang 技术栈",
    description:
      "基于 LangChain 与 LangGraph 框架，构建更可靠的研究流程。",
    href: "https://www.langchain.com/",
    cta: "了解更多",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Usb,
    name: "MCP 集成",
    description:
      "无缝集成 MCP，助力扩展研究工具箱，提升工作流效率。",
    href: "https://github.com/bytedance/deer-flow/blob/main/src/graph/nodes.py",
    cta: "了解更多",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Podcast,
    name: "播客生成",
    description:
      "一键将报告转为播客，随时随地学习或轻松分享研究成果。",
    href: "https://github.com/bytedance/deer-flow/blob/main/src/podcast",
    cta: "了解更多",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
];

export function CoreFeatureSection() {
  return (
    <section className="relative flex w-full flex-col content-around items-center justify-center">
      <SectionHeader
        anchor="core-features"
        title="核心功能"
        description="了解 DeerFlow 的高效之处。"
      />
      <BentoGrid className="w-3/4 lg:grid-cols-2 lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  );
}
