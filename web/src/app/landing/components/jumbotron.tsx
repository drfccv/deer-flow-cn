// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { GithubFilled } from "@ant-design/icons";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { AuroraText } from "~/components/magicui/aurora-text";
import { FlickeringGrid } from "~/components/magicui/flickering-grid";
import { Button } from "~/components/ui/button";
import { env } from "~/env";

export function Jumbotron() {
  return (
    <section className="flex h-[95vh] w-full flex-col items-center justify-center pb-15">
      <FlickeringGrid
        id="deer-hero-bg"
        className={`absolute inset-0 z-0 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]`}
        squareSize={4}
        gridGap={4}
        color="#60A5FA"
        maxOpacity={0.133}
        flickerChance={0.1}
      />
      <FlickeringGrid
        id="deer-hero"
        className="absolute inset-0 z-0 translate-y-[2vh] mask-[url(/images/deer-hero.svg)] mask-size-[100vw] mask-center mask-no-repeat md:mask-size-[72vh]"
        squareSize={3}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.64}
        flickerChance={0.12}
      />
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        <h1 className="text-center text-4xl font-bold md:text-6xl">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            深度研究
          </span>
          <AuroraText>触手可及</AuroraText>
        </h1>
        <p className="max-w-4xl p-2 text-center text-sm opacity-85 md:text-2xl">
          认识 DeerFlow，您的专属深度研究助手。集成强大的搜索引擎、网页爬虫、Python 与 MCP 服务，助您即时洞察、生成全面报告，甚至播客内容。
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center w-full">
          <Button className="max-w-xs w-auto md:w-44 text-lg font-bold flex items-center justify-center" size="lg">
            <Link
              target={
                env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY ? "_blank" : undefined
              }
              href={
                env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY
                  ? "https://github.com/drfccv/deer-flow-cn"
                  : "/chat"
              }
              className="flex items-center justify-center gap-1 w-full h-full"
            >
              立即体验 <ChevronRight />
            </Link>
          </Button>
          {!env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && (
            <Button className="max-w-xs w-auto md:w-44 text-lg font-bold flex items-center justify-center" size="lg" variant="outline">
              <a
                href="https://github.com/drfccv/deer-flow-cn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 w-full h-full"
              >
                <GithubFilled />
                了解更多
              </a>
            </Button>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 flex text-xs opacity-50">
        <p>* DEER 代表 Deep Exploration and Efficient Research（深度探索与高效研究）。</p>
      </div>
    </section>
  );
}
