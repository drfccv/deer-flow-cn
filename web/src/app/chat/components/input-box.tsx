// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Detective } from "~/components/deer-flow/icons/detective";
import { Tooltip } from "~/components/deer-flow/tooltip";
import { Button } from "~/components/ui/button";
import type { Option } from "~/core/messages";
import {
  setEnableBackgroundInvestigation,
  useSettingsStore,
} from "~/core/store";
import { cn } from "~/lib/utils";

export function InputBox({
  className,
  size,
  responding,
  feedback,
  onSend,
  onCancel,
  onRemoveFeedback,
}: {
  className?: string;
  size?: "large" | "normal";
  responding?: boolean;
  feedback?: { option: Option } | null;
  onSend?: (message: string, options?: { interruptFeedback?: string; mode?: "research" | "chat" }) => void;
  onCancel?: () => void;
  onRemoveFeedback?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [imeStatus, setImeStatus] = useState<"active" | "inactive">("inactive");
  const [indent, setIndent] = useState(0);
  const [mode, setMode] = useState<"research" | "chat">(() => {
    // 初始化时从localStorage读取
    if (typeof window !== 'undefined') {
      return (localStorage.getItem("chat_input_mode") as "research" | "chat") || "research";
    }
    return "research";
  });
  const backgroundInvestigation = useSettingsStore(
    (state) => state.general.enableBackgroundInvestigation,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // 自动调整 textarea 高度以实现多行自适应
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    if (feedback) {
      setMessage("");

      setTimeout(() => {
        if (feedbackRef.current) {
          setIndent(feedbackRef.current.offsetWidth);
        }
      }, 200);
    }
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [feedback]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  const handleSetMode = (m: "research" | "chat") => {
    setMode(m);
    localStorage.setItem("chat_input_mode", m);
  };

  const handleSendMessage = useCallback(() => {
    if (responding) {
      onCancel?.();
    } else {
      if (message.trim() === "") {
        return;
      }
      if (onSend) {
        onSend(message, {
          interruptFeedback: feedback?.option.value,
          mode,
        });
        setMessage("");
        onRemoveFeedback?.();
      }
    }
  }, [responding, onCancel, message, onSend, feedback, onRemoveFeedback, mode]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (responding) {
        return;
      }
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        imeStatus === "inactive"
      ) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [responding, imeStatus, handleSendMessage],
  );

  return (
    <div
      className={cn("bg-card relative rounded-[24px] border flex flex-col", className)}
      style={{ minHeight: 'unset', height: 'auto' }}
    >
      {/* 模式切换按钮组 */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1 shrink-0">
        <span className="text-sm text-muted-foreground">对话模式：</span>
        <Button
          variant={mode === "research" ? "default" : "outline"}
          size="sm"
          className="rounded-full px-4"
          onClick={() => handleSetMode("research")}
        >
          研究模式
        </Button>
        <Button
          variant={mode === "chat" ? "default" : "outline"}
          size="sm"
          className="rounded-full px-4"
          onClick={() => handleSetMode("chat")}
        >
          对话模式
        </Button>
      </div>
      {/* 输入框区域 */}
      <div className="w-full px-0 pt-0 pb-0 bg-transparent mb-2" style={{ position: 'relative' }}>
        <AnimatePresence>
          {feedback && (
            <motion.div
              ref={feedbackRef}
              className="bg-background border-brand absolute top-0 left-0 mt-3 ml-2 flex items-center justify-center gap-1 rounded-2xl border px-2 py-0.5 z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="text-brand flex h-full w-full items-center justify-center text-sm opacity-90">
                {feedback.option.text}
              </div>
              <X
                className="cursor-pointer opacity-60"
                size={16}
                onClick={onRemoveFeedback}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          ref={textareaRef}
          className={cn(
            "m-0 w-full resize-none border-none px-4 py-3 text-lg bg-transparent outline-none rounded-xl transition-all duration-200",
            size === "large" ? "min-h-32" : "min-h-4",
          )}
          style={{
            textIndent: feedback ? `${indent}px` : 0,
            minHeight: size === "large" ? 128 : 32,
            maxHeight: 320,
            overflowY: 'auto',
            boxSizing: 'border-box',
            display: 'block',
          }}
          placeholder={
            feedback
              ? `请描述您如何${feedback.option.text.toLocaleLowerCase()}？`
              : mode === "chat"
              ? "请输入您的问题或与我闲聊..."
              : "我能为您做些什么？"
          }
          value={message}
          onCompositionStart={() => setImeStatus("active")}
          onCompositionEnd={() => setImeStatus("inactive")}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            setMessage(event.target.value);
            adjustTextareaHeight();
          }}
        />
      </div>
      {/* 底部控件区域 */}
      <div className="flex items-center px-4 py-2 gap-2 mt-0">
        <div className="flex grow">
          <Tooltip
            className="max-w-60"
            title={
              <div>
                <h3 className="mb-2 font-bold">
                  背景调查模式：{backgroundInvestigation ? "开启" : "关闭"}
                </h3>
                <p>
                  启用后，DeerFlow 会在规划前进行快速搜索。适用于与最新事件和新闻相关的研究。
                </p>
              </div>
            }
          >
            <Button
              className={cn(
                "rounded-2xl",
                backgroundInvestigation && "!border-brand !text-brand",
              )}
              variant="outline"
              size="lg"
              onClick={() =>
                setEnableBackgroundInvestigation(!backgroundInvestigation)
              }
            >
              <Detective /> 背景调查
            </Button>
          </Tooltip>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Tooltip title={responding ? "停止" : "发送"}>
            <Button
              variant="outline"
              size="icon"
              className={cn("h-10 w-10 rounded-full")}
              onClick={handleSendMessage}
            >
              {responding ? (
                <div className="flex h-10 w-10 items-center justify-center">
                  <div className="bg-foreground h-4 w-4 rounded-sm opacity-70" />
                </div>
              ) : (
                <ArrowUp />
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
