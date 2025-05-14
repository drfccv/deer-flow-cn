// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useMemo } from "react";

import { useStore } from "~/core/store";
import { cn } from "~/lib/utils";

import { MessagesBlock } from "./components/messages-block";
import { ResearchBlock } from "./components/research-block";

export default function Main() {
  const openResearchId = useStore((state) => state.openResearchId);
  const doubleColumnMode = useMemo(
    () => openResearchId !== null,
    [openResearchId],
  );
  return (
    <div
      className={cn(
        // 绝对居中方案，最大宽度1600px
        "absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-full max-w-[1600px] px-2 pt-12 pb-4 sm:px-4",
        doubleColumnMode ? "gap-4 md:gap-8 flex-row flex" : "flex-col flex",
      )}
    >
      <MessagesBlock
        className={cn(
          // 响应式宽度
          "shrink-0 transition-all duration-300 ease-out w-full max-w-full md:max-w-[768px]",
          doubleColumnMode
            ? "md:w-[538px] md:translate-x-0"
            : "md:w-[768px] md:translate-x-[min(calc((100vw-538px)*0.75/2),480px)]",
        ) + " mb-6"} // 增加底部外边距让输入框下移
      />
      <ResearchBlock
        className={cn(
          // 响应式宽度和显示
          "w-full max-w-full pb-4 transition-all duration-300 ease-out",
          doubleColumnMode ? "md:w-[min(calc((100vw-538px)*0.75),960px)] scale-100" : "scale-0 md:scale-0",
        )}
        researchId={openResearchId}
      />
    </div>
  );
}
