// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { Check, Copy, Headphones, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ScrollContainer } from "~/components/deer-flow/scroll-container";
import { Tooltip } from "~/components/deer-flow/tooltip";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useReplay } from "~/core/replay";
import { closeResearch, listenToPodcast, useStore } from "~/core/store";
import { cn } from "~/lib/utils";

import { ResearchActivitiesBlock } from "./research-activities-block";
import { ResearchReportBlock } from "./research-report-block";

export function ResearchBlock({
  className,
  researchId = null,
  renderActions = false,
  hideActions = false,
}: {
  className?: string;
  researchId: string | null;
  renderActions?: boolean;
  hideActions?: boolean;
}) {
  const reportId = useStore((state) =>
    researchId ? state.researchReportIds.get(researchId) : undefined,
  );
  const [activeTab, setActiveTab] = useState("activities");
  const hasReport = useStore((state) =>
    researchId ? state.researchReportIds.has(researchId) : false,
  );
  const reportStreaming = useStore((state) =>
    reportId ? (state.messages.get(reportId)?.isStreaming ?? false) : false,
  );
  const { isReplay } = useReplay();
  useEffect(() => {
    if (hasReport) {
      setActiveTab("report");
    }
  }, [hasReport]);

  const handleGeneratePodcast = useCallback(async () => {
    if (!researchId) {
      return;
    }
    await listenToPodcast(researchId);
  }, [researchId]);

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if (!reportId) {
      return;
    }
    const report = useStore.getState().messages.get(reportId);
    if (!report) {
      return;
    }
    void navigator.clipboard.writeText(report.content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [reportId]);

  // When the research id changes, set the active tab to activities
  useEffect(() => {
    if (!hasReport) {
      setActiveTab("activities");
    }
  }, [hasReport, researchId]);

  // 操作按钮区域
  const actions = (
    <>
      {hasReport && !reportStreaming && (
        <>
          <Tooltip title="Generate podcast">
            <Button
              className="text-gray-400"
              size="icon"
              variant="ghost"
              disabled={isReplay}
              onClick={handleGeneratePodcast}
            >
              <Headphones />
            </Button>
          </Tooltip>
          <Tooltip title="Copy">
            <Button
              className="text-gray-400"
              size="icon"
              variant="ghost"
              onClick={handleCopy}
            >
              {copied ? <Check /> : <Copy />}
            </Button>
          </Tooltip>
        </>
      )}
      <Tooltip title="Close">
        <Button
          className="text-gray-400"
          size="sm"
          variant="ghost"
          onClick={() => {
            closeResearch();
          }}
        >
          <X />
        </Button>
      </Tooltip>
    </>
  );

  if (renderActions) {
    // 只渲染操作按钮，不渲染 Card
    return <div className="flex h-9 items-center justify-center">{actions}</div>;
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <Card className={cn("relative h-full w-full pt-4", className)}>
        {!hideActions && !renderActions && (
          <div className="absolute right-4 flex h-9 items-center justify-center">
            {actions}
          </div>
        )}
        <Tabs
          className="flex h-full w-full flex-col"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex w-full justify-center">
            <TabsList className="">
              <TabsTrigger
                className="px-8"
                value="report"
                disabled={!hasReport}
              >
                Report
              </TabsTrigger>
              <TabsTrigger className="px-8" value="activities">
                Activities
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            className="h-full min-h-0 flex-grow px-8"
            value="report"
            forceMount
            hidden={activeTab !== "report"}
          >
            <ScrollContainer
              className="px-5pb-20 h-full"
              scrollShadowColor="var(--card)"
              autoScrollToBottom={!hasReport || reportStreaming}
            >
              {reportId && researchId && (
                <ResearchReportBlock
                  className="mt-4"
                  researchId={researchId}
                  messageId={reportId}
                />
              )}
            </ScrollContainer>
          </TabsContent>
          <TabsContent
            className="h-full min-h-0 flex-grow px-8"
            value="activities"
            forceMount
            hidden={activeTab !== "activities"}
          >
            <ScrollContainer
              className="h-full"
              scrollShadowColor="var(--card)"
              autoScrollToBottom={!hasReport || reportStreaming}
            >
              {researchId && (
                <ResearchActivitiesBlock
                  className="mt-4"
                  researchId={researchId}
                />
              )}
            </ScrollContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
