// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { Bike, Building, Film, Github, Ham, Home, Pizza } from "lucide-react";
import { Bot } from "lucide-react";

import { BentoCard } from "~/components/magicui/bento-grid";

import { SectionHeader } from "../components/section-header";

const caseStudies = [
  {
    id: "eiffel-tower-vs-tallest-building",
    icon: Building,
    title: "埃菲尔铁塔与最高建筑有多高？",
    description:
      "本研究比较了埃菲尔铁塔与哈利法塔的高度及其全球意义，并用 Python 代码计算倍数。",
  },
  {
    id: "github-top-trending-repo",
    icon: Github,
    title: "GitHub 上最热门的仓库有哪些？",
    description:
      "本研究利用 MCP 服务识别最受欢迎的 GitHub 仓库，并通过搜索引擎详细记录。",
  },
  {
    id: "nanjing-traditional-dishes",
    icon: Ham,
    title: "撰写一篇关于南京传统美食的文章",
    description:
      "通过丰富内容和图片生动展现南京名菜，挖掘其背后的历史与文化。",
  },
  {
    id: "rental-apartment-decoration",
    icon: Home,
    title: "如何装饰小型租赁公寓？",
    description:
      "为读者提供实用、直接的公寓装饰方法，并配有灵感图片。",
  },
  {
    id: "review-of-the-professional",
    icon: Film,
    title: "介绍电影《这个杀手不太冷》",
    description:
      "全面介绍电影《这个杀手不太冷》，包括剧情、角色和主题。",
  },
  {
    id: "china-food-delivery",
    icon: Bike,
    title: "你如何看待中国的外卖大战？（中文）",
    description:
      "分析京东与美团日益激烈的竞争，突出其战略、技术创新与挑战。",
  },
  {
    id: "ultra-processed-foods",
    icon: Pizza,
    title: "高度加工食品与健康有关吗？",
    description:
      "探讨高度加工食品消费增加的健康风险，呼吁更多关于长期影响和个体差异的研究。",
  },
  {
    id: "ai-twin-insurance",
    icon: Bot,
    title: '写一篇“你会为你的AI数字分身投保吗？”的文章',
    description:
      "探讨为AI数字分身投保的概念，突出其益处、风险、伦理考量及监管演变。",
  },
];

export function CaseStudySection() {
  return (
    <section className="relative container hidden flex-col items-center justify-center md:flex">
      <SectionHeader
        anchor="case-studies"
        title="案例演示"
        description="通过回放了解 DeerFlow 的实际应用。"
      />
      <div className="grid w-3/4 grid-cols-1 gap-2 sm:w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {caseStudies.map((caseStudy) => (
          <div key={caseStudy.title} className="w-full p-2">
            <BentoCard
              {...{
                Icon: caseStudy.icon,
                name: caseStudy.title,
                description: caseStudy.description,
                href: `/chat?replay=${caseStudy.id}`,
                cta: "点击观看回放",
                className: "w-full h-full",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
