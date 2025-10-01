// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useMemo } from "react";

import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { useConversationStore } from "~/core/conversation-store";
import { useStore, closeResearch } from "~/core/store";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

import { ConversationHistorySidebar } from "./components/conversation-history-sidebar";
import { MessagesBlock } from "./components/messages-block";
import { ResearchBlock } from "./components/research-block";

export default function Main() {
  const openResearchId = useStore((state) => state.openResearchId);
  const doubleColumnMode = useMemo(
    () => openResearchId !== null,
    [openResearchId],
  );
  const isMobile = useIsMobile();
  const { sidebarOpen } = useConversationStore();

  // 传递 renderActions 以便在移动端弹窗时将按钮渲染到 DialogTitle
  return (
    <div className="flex h-full w-full">
      {/* 侧边栏 - 统一处理桌面端和移动端 */}
      <ConversationHistorySidebar />

      {/* 主内容区域 */}
      <div
        className={cn(
          // 全屏布局，为悬浮侧边栏腾出空间
          "w-full h-full transition-all duration-300 ease-in-out",
          doubleColumnMode ? "gap-4 md:gap-8 flex-row flex" : "flex-col flex",
          // 移动端优化：侧边栏展开时不调整布局（因为是覆盖式），桌面端保留左侧空间
          sidebarOpen 
            ? "px-2 pt-12 pb-4 sm:px-4 sm:pl-[336px] sm:pr-4" // 移动端正常边距，桌面端左侧留空间
            : "px-2 pt-12 pb-4 sm:px-4 sm:pl-[80px]", // 收起状态宽度(64) + 间距(16)
        )}
      >
        <div
          className={cn(
            // 内容容器
            "w-full h-full mx-auto",
            doubleColumnMode ? "gap-4 md:gap-8 flex-row flex" : "flex-col flex",
            // 限制最大宽度并居中
            "max-w-[1600px]"
          )}
        >
      <MessagesBlock
        className={cn(
          // 响应式宽度
          "shrink-0 transition-all duration-300 ease-in-out w-full max-w-full md:max-w-[768px]",
          doubleColumnMode
            ? "md:w-[538px] md:translate-x-0"
            : "md:w-[768px] md:translate-x-[min(calc((100vw-538px)*0.75/2),480px)]",
        ) + " mb-6"} // 增加底部外边距让输入框下移
      />
      {/* 移动端弹窗展示 ResearchBlock，PC 端仍为双栏 */}
      {isMobile ? (
        <Dialog open={!!openResearchId} onOpenChange={(open) => { if (!open) closeResearch(); }}>
          <DialogContent className="max-w-full w-full h-screen max-h-screen p-0 flex flex-col rounded-none" hideClose>
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <DialogTitle className="text-base font-semibold">研究详情</DialogTitle>
              {openResearchId && (
                <ResearchBlock
                  researchId={openResearchId}
                  renderActions
                />
              )}
            </div>
            {openResearchId && (
              <ResearchBlock
                className="h-full w-full"
                researchId={openResearchId}
                hideActions
              />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <ResearchBlock
          className={cn(
            // 响应式宽度和显示
            "w-full max-w-full pb-4 transition-all duration-300 ease-out",
            doubleColumnMode ? "md:w-[min(calc((100vw-538px)*0.75),960px)] scale-100" : "scale-0 md:scale-0",
          )}
          researchId={openResearchId}
        />
      )}
        </div>
      </div>
    </div>
  );
}
