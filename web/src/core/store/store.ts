// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { nanoid } from "nanoid";
import { toast } from "sonner";
import { create } from "zustand";

import { chatStream, generatePodcast } from "../api";
import { conversationAPI } from "../conversation-api";
import type { ConversationMessage } from "../conversation-types";
import type { Message } from "../messages";
import { mergeMessage } from "../messages";
import { parseJSON } from "../utils";

import { getChatStreamSettings } from "./settings-store";

const THREAD_ID = nanoid();

export const useStore = create<{
  responding: boolean;
  threadId: string | undefined;
  conversationId: string | null;
  messageIds: string[];
  messages: Map<string, Message>;
  researchIds: string[];
  researchPlanIds: Map<string, string>;
  researchReportIds: Map<string, string>;
  researchActivityIds: Map<string, string[]>;
  ongoingResearchId: string | null;
  openResearchId: string | null;
  savedMessageIds: Set<string>; // 跟踪已保存的消息ID
  currentMode: "research" | "chat"; // 当前对话模式

  appendMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  updateMessages: (messages: Message[]) => void;
  openResearch: (researchId: string | null) => void;
  closeResearch: () => void;
  setOngoingResearch: (researchId: string | null) => void;
  setConversation: (conversationId: string, threadId: string) => void;
  clearConversation: () => void;
  setCurrentMode: (mode: "research" | "chat") => void;
  saveMessageToConversation: (message: Message) => Promise<void>;
}>((set, get) => ({
  responding: false,
  threadId: THREAD_ID,
  conversationId: null,
  messageIds: [],
  messages: new Map<string, Message>(),
  researchIds: [],
  researchPlanIds: new Map<string, string>(),
  researchReportIds: new Map<string, string>(),
  researchActivityIds: new Map<string, string[]>(),
  ongoingResearchId: null,
  openResearchId: null,
  savedMessageIds: new Set<string>(),
  currentMode: "research" as const, // 默认研究模式

  appendMessage(message: Message) {
    set((state) => ({
      messageIds: [...state.messageIds, message.id],
      messages: new Map(state.messages).set(message.id, message),
    }));
  },
  updateMessage(message: Message) {
    set((state) => ({
      messages: new Map(state.messages).set(message.id, message),
    }));
  },
  updateMessages(messages: Message[]) {
    set((state) => {
      const newMessages = new Map(state.messages);
      messages.forEach((m) => newMessages.set(m.id, m));
      return { messages: newMessages };
    });
  },
  openResearch(researchId: string | null) {
    set({ openResearchId: researchId });
  },
  closeResearch() {
    set({ openResearchId: null });
  },
  setOngoingResearch(researchId: string | null) {
    set({ ongoingResearchId: researchId });
  },
  setConversation(conversationId: string, threadId: string) {
    set({ 
      conversationId, 
      threadId,
      // 清空当前消息，为新对话做准备
      messageIds: [],
      messages: new Map<string, Message>(),
      researchIds: [],
      researchPlanIds: new Map<string, string>(),
      researchReportIds: new Map<string, string>(),
      researchActivityIds: new Map<string, string[]>(),
      savedMessageIds: new Set<string>(), // 清空已保存消息记录
    });
  },
  clearConversation() {
    set({ 
      conversationId: null,
      threadId: nanoid(), // 生成新的线程ID
      messageIds: [],
      messages: new Map<string, Message>(),
      researchIds: [],
      researchPlanIds: new Map<string, string>(),
      researchReportIds: new Map<string, string>(),
      researchActivityIds: new Map<string, string[]>(),
      savedMessageIds: new Set<string>(), // 清空已保存消息记录
    });
  },
  setCurrentMode(mode: "research" | "chat") {
    set({ currentMode: mode });
  },
  async saveMessageToConversation(message: Message) {
    const state = get();
    
    if (!state.conversationId || message.isStreaming) {
      return;
    }

    // 检查是否已经保存过这条消息
    if (state.savedMessageIds.has(message.id)) {
      return;
    }

    try {
      // 转换消息格式
      const conversationMessage: ConversationMessage = {
        id: message.id,
        conversation_id: state.conversationId,
        thread_id: message.threadId,
        role: message.role === "tool" ? "assistant" : message.role as "user" | "assistant",
        content: message.content,
        agent: message.agent,
        timestamp: new Date().toISOString(),
        metadata: {
          contentChunks: message.contentChunks,
          toolCalls: message.toolCalls,
          isStreaming: message.isStreaming,
          options: message.options, // 保存 interrupt 消息的 options 数据
          finishReason: message.finishReason, // 保存 finishReason 用于识别 interrupt 消息
        },
      };

      // 实际保存到本地存储
      const result = conversationAPI.addMessageToConversation(state.conversationId, conversationMessage);
      if (result) {
        
        // 标记消息已保存，防止重复保存
        set((currentState) => ({
          savedMessageIds: new Set([...currentState.savedMessageIds, message.id])
        }));
      } else {
        console.error('Failed to save message to conversation: conversation not found');
      }
    } catch (error) {
      console.error('Failed to save message to conversation:', error);
    }
  },
}));

export async function sendMessage(
  content?: string,
  {
    interruptFeedback,
    mode = "research",
  }: {
    interruptFeedback?: string;
    mode?: "research" | "chat";
  } = {},
  options: { abortSignal?: AbortSignal } = {},
) {
  // 如果有消息内容但没有当前对话，创建新对话
  if (content != null) {
    const currentState = useStore.getState();
    
    // 如果没有当前对话，自动创建新对话
    if (!currentState.conversationId) {
      // 动态导入conversation store以避免循环依赖
      const { useConversationStore } = await import('../conversation-store');
      const conversationStore = useConversationStore.getState();
      const conversationId = conversationStore.createNewConversation(
        `新对话 ${new Date().toLocaleString('zh-CN')}`,
        undefined, // 不在创建对话时添加消息，而是在下面统一添加
        mode // 传递当前模式
      );
      // 不需要手动设置conversation，因为createNewConversation已经会调用setConversation
      // 设置当前对话模式
      currentState.setCurrentMode(mode);
    }
    
    // 重新获取状态，因为可能已经创建了新对话
    const updatedState = useStore.getState();
    
    // 创建用户消息
    const userMessage = {
      id: nanoid(),
      threadId: updatedState.threadId || THREAD_ID,
      role: "user" as const,
      content: content,
      contentChunks: [content],
      isStreaming: false, // 用户消息不是streaming状态
    };
    
    appendMessage(userMessage);
  }

  // 获取当前状态，确保使用正确的threadId
  const currentState = useStore.getState();
  const currentThreadId = currentState.threadId || THREAD_ID;

  const settings = getChatStreamSettings(mode);
  const stream = chatStream(
    content ?? "[REPLAY]",
    {
      thread_id: currentThreadId,
      interrupt_feedback: interruptFeedback,
      auto_accepted_plan: settings.autoAcceptedPlan,
      enable_background_investigation:
        settings.enableBackgroundInvestigation ?? true,
      max_plan_iterations: settings.maxPlanIterations,
      max_step_num: settings.maxStepNum,
      mcp_settings: settings.mcpSettings,
      mode,
      prompt: settings.prompt, // 新增，携带prompt
    },
    options,
  );

  setResponding(true);
  let messageId: string | undefined;
  try {
    for await (const event of stream) {
      const { type, data } = event;
      messageId = data.id;
      let message: Message | undefined;
      if (type === "tool_call_result") {
        message = findMessageByToolCallId(data.tool_call_id);
      } else if (!existsMessage(messageId)) {
        message = {
          id: messageId,
          threadId: data.thread_id,
          agent: data.agent,
          role: data.role,
          content: "",
          contentChunks: [],
          isStreaming: true,
          interruptFeedback,
        };
        appendMessage(message);
      }
      message ??= getMessage(messageId);
      if (message) {
        message = mergeMessage(message, event);
        updateMessage(message);
      }
    }
  } catch {
    toast("An error occurred while generating the response. Please try again.");
    // Update message status.
    // TODO: const isAborted = (error as Error).name === "AbortError";
    if (messageId != null) {
      const message = getMessage(messageId);
      if (message?.isStreaming) {
        message.isStreaming = false;
        useStore.getState().updateMessage(message);
      }
    }
    useStore.getState().setOngoingResearch(null);
  } finally {
    // 确保最后的消息被保存到对话历史（去重机制会防止重复保存）
    if (messageId != null) {
      const finalMessage = getMessage(messageId);
      const store = useStore.getState();
      if (finalMessage && store.conversationId && !finalMessage.isStreaming) {
        store.saveMessageToConversation(finalMessage);
      }
    }
    setResponding(false);
  }
}

function setResponding(value: boolean) {
  useStore.setState({ responding: value });
}

function existsMessage(id: string) {
  return useStore.getState().messageIds.includes(id);
}

function getMessage(id: string) {
  return useStore.getState().messages.get(id);
}

function findMessageByToolCallId(toolCallId: string) {
  return Array.from(useStore.getState().messages.values())
    .reverse()
    .find((message) => {
      if (message.toolCalls) {
        return message.toolCalls.some((toolCall) => toolCall.id === toolCallId);
      }
      return false;
    });
}

function appendMessage(message: Message) {
  // console.log('AppendMessage called:', message.role, message.id, 'isStreaming:', message.isStreaming);

  if (
    message.agent === "coder" ||
    message.agent === "reporter" ||
    message.agent === "researcher"
  ) {
    if (!getOngoingResearchId()) {
      const id = message.id;
      appendResearch(id);
      openResearch(id);
    }
    appendResearchActivity(message);
  }
  
  const store = useStore.getState();
  store.appendMessage(message);
  
  // 如果有当前对话且消息不是streaming状态，立即保存消息到对话历史
  if (store.conversationId && !message.isStreaming) {
    store.saveMessageToConversation(message);
  }
}

function updateMessage(message: Message) {
  const store = useStore.getState();
  const oldMessage = store.messages.get(message.id);
  const wasStreaming = oldMessage?.isStreaming;
  const nowNotStreaming = !message.isStreaming;
  
  if (
    getOngoingResearchId() &&
    message.agent === "reporter" &&
    !message.isStreaming
  ) {
    useStore.getState().setOngoingResearch(null);
  }
  
  store.updateMessage(message);
  
  // 如果消息现在是完成状态（不是streaming），保存到对话历史
  if (store.conversationId && !message.isStreaming) {
    store.saveMessageToConversation(message);
  }
  
  // 移除额外检查，因为我们已经有了去重机制
}

function getOngoingResearchId() {
  return useStore.getState().ongoingResearchId;
}

function appendResearch(researchId: string) {
  let planMessage: Message | undefined;
  const reversedMessageIds = [...useStore.getState().messageIds].reverse();
  for (const messageId of reversedMessageIds) {
    const message = getMessage(messageId);
    if (message?.agent === "planner") {
      planMessage = message;
      break;
    }
  }
  const messageIds = [researchId];
  messageIds.unshift(planMessage!.id);
  useStore.setState({
    ongoingResearchId: researchId,
    researchIds: [...useStore.getState().researchIds, researchId],
    researchPlanIds: new Map(useStore.getState().researchPlanIds).set(
      researchId,
      planMessage!.id,
    ),
    researchActivityIds: new Map(useStore.getState().researchActivityIds).set(
      researchId,
      messageIds,
    ),
  });
}

function appendResearchActivity(message: Message) {
  const researchId = getOngoingResearchId();
  if (researchId) {
    const researchActivityIds = useStore.getState().researchActivityIds;
    const current = researchActivityIds.get(researchId)!;
    if (!current.includes(message.id)) {
      useStore.setState({
        researchActivityIds: new Map(researchActivityIds).set(researchId, [
          ...current,
          message.id,
        ]),
      });
    }
    if (message.agent === "reporter") {
      useStore.setState({
        researchReportIds: new Map(useStore.getState().researchReportIds).set(
          researchId,
          message.id,
        ),
      });
    }
  }
}

export function openResearch(researchId: string | null) {
  useStore.getState().openResearch(researchId);
}

export function closeResearch() {
  useStore.getState().closeResearch();
}

export async function listenToPodcast(researchId: string) {
  const planMessageId = useStore.getState().researchPlanIds.get(researchId);
  const reportMessageId = useStore.getState().researchReportIds.get(researchId);
  if (planMessageId && reportMessageId) {
    const planMessage = getMessage(planMessageId)!;
    const title = parseJSON(planMessage.content, { title: "Untitled" }).title;
    const reportMessage = getMessage(reportMessageId);
    if (reportMessage?.content) {
      appendMessage({
        id: nanoid(),
        threadId: THREAD_ID,
        role: "user",
        content: "Please generate a podcast for the above research.",
        contentChunks: [],
      });
      const podCastMessageId = nanoid();
      const podcastObject = { title, researchId };
      const podcastMessage: Message = {
        id: podCastMessageId,
        threadId: THREAD_ID,
        role: "assistant",
        agent: "podcast",
        content: JSON.stringify(podcastObject),
        contentChunks: [],
        isStreaming: true,
      };
      appendMessage(podcastMessage);
      // Generating podcast...
      const audioUrl = await generatePodcast(reportMessage.content);
      useStore.setState((state) => ({
        messages: new Map(useStore.getState().messages).set(podCastMessageId, {
          ...state.messages.get(podCastMessageId)!,
          content: JSON.stringify({ ...podcastObject, audioUrl }),
          isStreaming: false,
        }),
      }));
    }
  }
}

export function useResearchTitle(researchId: string) {
  const planMessage = useMessage(
    useStore.getState().researchPlanIds.get(researchId),
  );
  return planMessage
    ? parseJSON(planMessage.content, { title: "" }).title
    : undefined;
}

export function useMessage(messageId: string | null | undefined) {
  return useStore((state) =>
    messageId ? state.messages.get(messageId) : undefined,
  );
}

export function setCurrentMode(mode: "research" | "chat") {
  useStore.getState().setCurrentMode(mode);
}

export function getCurrentMode(): "research" | "chat" {
  return useStore.getState().currentMode;
}
