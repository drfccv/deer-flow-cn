// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { PythonOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { LRUCache } from "lru-cache";
import { BookOpenText, PencilRuler, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { FavIcon } from "~/components/deer-flow/fav-icon";
import Image from "~/components/deer-flow/image";
import { LoadingAnimation } from "~/components/deer-flow/loading-animation";
import { Markdown } from "~/components/deer-flow/markdown";
import { RainbowText } from "~/components/deer-flow/rainbow-text";
import { Tooltip } from "~/components/deer-flow/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { findMCPTool } from "~/core/mcp";
import type { ToolCallRuntime } from "~/core/messages";
import { useMessage, useStore } from "~/core/store";
import { parseJSON } from "~/core/utils";
import { cn } from "~/lib/utils";

export function ResearchActivitiesBlock({
  className,
  researchId,
}: {
  className?: string;
  researchId: string;
}) {
  const activityIds = useStore((state) =>
    state.researchActivityIds.get(researchId),
  )!;
  const ongoing = useStore((state) => state.ongoingResearchId === researchId);
  return (
    <>
      <ul className={cn("flex flex-col py-4", className)}>
        {activityIds.map(
          (activityId, i) =>
            i !== 0 && (
              <motion.li
                key={activityId}
                style={{ transition: "all 0.4s ease-out" }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                <div className="max-w-full overflow-x-auto">
                  <ActivityMessage messageId={activityId} />
                </div>
                <div className="max-w-full overflow-x-auto">
                  <ActivityListItem messageId={activityId} />
                </div>
                {i !== activityIds.length - 1 && <hr className="my-8" />}
              </motion.li>
            ),
        )}
      </ul>
      {ongoing && <LoadingAnimation className="mx-4 my-12" />}
    </>
  );
}

function ActivityMessage({ messageId }: { messageId: string }) {
  const message = useMessage(messageId);
  if (message?.agent && message.content) {
    if (message.agent !== "reporter" && message.agent !== "planner") {
      return (
        <div className="px-4 py-2 overflow-x-auto">
          <div className="inline-block min-w-full">
            <Markdown animated>{message.content}</Markdown>
          </div>
        </div>
      );
    }
  }
  return null;
}

function ActivityListItem({ messageId }: { messageId: string }) {
  const message = useMessage(messageId);
  if (message) {
    if (!message.isStreaming && message.toolCalls?.length) {
      for (const toolCall of message.toolCalls) {
        if (toolCall.name === "web_search") {
          return <WebSearchToolCall key={toolCall.id} toolCall={toolCall} />;
        } else if (toolCall.name === "crawl_tool") {
          return <CrawlToolCall key={toolCall.id} toolCall={toolCall} />;
        } else if (toolCall.name === "python_repl_tool") {
          return <PythonToolCall key={toolCall.id} toolCall={toolCall} />;
        } else {
          return <MCPToolCall key={toolCall.id} toolCall={toolCall} />;
        }
      }
    }
  }
  return null;
}

const __pageCache = new LRUCache<string, string>({ max: 100 });
type SearchResult =
  | {
      type: "page";
      title: string;
      url: string;
      content: string;
    }
  | {
      type: "image";
      image_url: string;
      image_description: string;
    };
function WebSearchToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  const searchResults = useMemo<SearchResult[]>(() => {
    let results: SearchResult[] | undefined = undefined;
    try {
      results = toolCall.result ? parseJSON(toolCall.result, []) : undefined;
    } catch {
      results = undefined;
    }
    if (Array.isArray(results)) {
      results.forEach((result) => {
        if (result.type === "page") {
          __pageCache.set(result.url, result.title);
        }
      });
    } else {
      results = [];
    }
    return results;
  }, [toolCall.result]);
  const pageResults = useMemo(
    () => searchResults?.filter((result) => result.type === "page"),
    [searchResults],
  );
  const imageResults = useMemo(
    () => searchResults?.filter((result) => result.type === "image"),
    [searchResults],
  );
  return (
    <section className="mt-4 pl-4">
      <div className="font-medium italic w-full">
        <div className="flex items-center w-full min-w-0 overflow-x-auto">
          <Search size={16} className={"mr-2"} />
          <span className="block sm:hidden">正在搜索</span>
          <span className="hidden sm:inline">
            Searching for&nbsp;
            <span className="flex-shrink-0 min-w-0 overflow-x-auto inline-block whitespace-nowrap text-ellipsis">
              {(toolCall.args as { query: string }).query}
            </span>
          </span>
        </div>
      </div>
      {/* 参考文献文本+超链接融合展示 */}
      {pageResults && pageResults.length > 0 && (
        <div className="mt-2 pr-4 text-sm min-w-0 overflow-x-auto">
          <span className="text-muted-foreground">参考文献：</span>
          {pageResults.map((result, i) => (
            <span key={result.url} className="inline-block whitespace-nowrap min-w-0 overflow-x-auto">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all hover:text-blue-800 min-w-0 overflow-x-auto"
                title={result.title}
              >
                {result.title}
              </a>
              {i !== pageResults.length - 1 && <span className="mx-1">|</span>}
            </span>
          ))}
        </div>
      )}
      {/* 图片结果保留原有卡片样式 */}
      {imageResults && imageResults.length > 0 && (
        <div className="pr-4 mt-2">
          <ul className="flex flex-nowrap gap-4 min-w-fit w-max overflow-x-auto">
            {imageResults.map((searchResult, i) => (
              <motion.li
                key={`search-result-image-${i}`}
                initial={{ opacity: 0, y: 10, scale: 0.66 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                <a
                  className="flex flex-col gap-2 overflow-hidden rounded-md opacity-75 transition-opacity duration-300 hover:opacity-100"
                  href={searchResult.image_url}
                  target="_blank"
                >
                  <Image
                    src={searchResult.image_url}
                    alt={searchResult.image_description}
                    className="bg-accent h-40 w-40 max-w-full rounded-md bg-cover bg-center bg-no-repeat"
                    imageClassName="hover:scale-110"
                    imageTransition
                  />
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function CrawlToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  const url = useMemo(
    () => (toolCall.args as { url: string }).url,
    [toolCall.args],
  );
  const title = useMemo(() => __pageCache.get(url), [url]);
  return (
    <section className="mt-4 pl-4">
      <div>
        <RainbowText
          className="flex items-center text-base font-medium italic"
          animated={toolCall.result === undefined}
        >
          <BookOpenText size={16} className={"mr-2"} />
          <span>Reading</span>
        </RainbowText>
      </div>
      <ul className="mt-2 flex flex-wrap gap-4">
        <motion.li
          className="text-muted-foreground bg-accent flex h-40 w-40 gap-2 rounded-md px-2 py-1 text-sm"
          initial={{ opacity: 0, y: 10, scale: 0.66 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <FavIcon className="mt-1" url={url} title={title} />
          <a
            className="h-full flex-grow overflow-hidden text-ellipsis whitespace-nowrap break-all"
            href={url}
            target="_blank"
          >
            {title ?? url}
          </a>
        </motion.li>
      </ul>
    </section>
  );
}

function PythonToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  // 修复Python代码缩进问题的辅助函数
  const fixPythonIndentation = (code: string): string => {
    if (!code) return "";
    
    // 分割代码行
    const lines = code.split("\n");
    
    // 查找最小公共缩进
    let minIndent = Infinity;
    for (const line of lines) {
      // 忽略空行
      if (line.trim() === "") continue;
      
      // 计算前导空格数
      const match = /^\s*/.exec(line);
      const indent = match ? match[0].length ?? 0 : 0;
      if (indent < minIndent) {
        minIndent = indent;
      }
    }
    
    // 如果找不到合适的缩进（空代码或只有空行），返回原始代码
    if (minIndent === Infinity) return code;
    
    // 移除每行的公共缩进
    const fixedLines = lines.map(line => {
      if (line.trim() === "") return line;
      return line.substring(minIndent);
    });
    
    return fixedLines.join("\n");
  };

  const code = useMemo<string>(() => {
    const rawCode = (toolCall.args as { code: string }).code;
    // 应用缩进修复
    return fixPythonIndentation(rawCode);
  }, [toolCall.args]);
  
  const output = useMemo(() => {
    if (typeof toolCall.result === "string") {
      return toolCall.result.trim();
    }
    return "";
  }, [toolCall.result]);

  // 将代码格式化为 Markdown 格式
  const codeMarkdown = useMemo(() => {
    return "```python\n" + code.trim() + "\n```";
  }, [code]);

  // 将输出格式化为 Markdown 格式
  const outputMarkdown = useMemo(() => {
    if (!output) return "";
    return "```\n" + output + "\n```";
  }, [output]);

  return (
    <section className="mt-4 pl-4">
      <div className="flex items-center mb-2">
        <PythonOutlined className="mr-2 flex-shrink-0" />
        <span className="text-base font-medium italic truncate">
          Running Python code
        </span>
      </div>
      
      {/* 直接使用 Markdown 组件渲染代码块 */}
      <div className="max-w-[calc(100%-16px)]">
        <Markdown>{codeMarkdown}</Markdown>
      </div>
      
      {/* 输出块也用 Markdown 组件渲染 */}
      {output && (
        <div className="max-w-[calc(100%-16px)] mt-2">
          <Markdown>{outputMarkdown}</Markdown>
        </div>
      )}
    </section>
  );
}

function MCPToolCall({ toolCall }: { toolCall: ToolCallRuntime }) {
  const tool = useMemo(() => findMCPTool(toolCall.name), [toolCall.name]);
  const { resolvedTheme } = useTheme();
  return (
    <section className="mt-4 pl-4">
      <div className="w-fit overflow-y-auto rounded-md py-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Tooltip title={tool?.description}>
                <div className="flex items-center font-medium italic">
                  <PencilRuler size={16} className={"mr-2"} />
                  <RainbowText
                    className="pr-0.5 text-base font-medium italic"
                    animated={toolCall.result === undefined}
                  >
                    Running {toolCall.name ? toolCall.name + "()" : "MCP tool"}
                  </RainbowText>
                </div>
              </Tooltip>
            </AccordionTrigger>
            <AccordionContent>
              {toolCall.result && (
                <div className="bg-accent max-h-[400px] max-w-[560px] overflow-y-auto rounded-md text-sm break-all">
                  <SyntaxHighlighter
                    language="json"
                    style={resolvedTheme === "dark" ? dark : docco}
                    customStyle={{
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    {toolCall.result.trim()}
                  </SyntaxHighlighter>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
