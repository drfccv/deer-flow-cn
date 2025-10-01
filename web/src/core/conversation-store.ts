// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ConversationSummary, ConversationDetail, ConversationMessage } from "./conversation-types";
import { useStore } from "./store";

// 本地存储键名
const CONVERSATIONS_STORAGE_KEY = "deer-flow-conversations";
const CONVERSATION_DETAILS_STORAGE_KEY = "deer-flow-conversation-details";

// 本地存储工具类
class LocalConversationStorage {
  static getConversations(): ConversationSummary[] {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveConversations(conversations: ConversationSummary[]): void {
    try {
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error("Failed to save conversations to localStorage:", error);
    }
  }

  static getConversationDetail(conversationId: string): ConversationDetail | null {
    try {
      const stored = localStorage.getItem(`${CONVERSATION_DETAILS_STORAGE_KEY}-${conversationId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static saveConversationDetail(conversation: ConversationDetail): void {
    try {
      localStorage.setItem(
        `${CONVERSATION_DETAILS_STORAGE_KEY}-${conversation.id}`,
        JSON.stringify(conversation)
      );
    } catch (error) {
      console.error("Failed to save conversation detail to localStorage:", error);
    }
  }

  static deleteConversationDetail(conversationId: string): void {
    try {
      localStorage.removeItem(`${CONVERSATION_DETAILS_STORAGE_KEY}-${conversationId}`);
    } catch (error) {
      console.error("Failed to delete conversation detail from localStorage:", error);
    }
  }

  static clearAllConversations(): void {
    try {
      // 清空对话列表
      localStorage.removeItem(CONVERSATIONS_STORAGE_KEY);
      
      // 清空所有对话详情
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(CONVERSATION_DETAILS_STORAGE_KEY)) {
          localStorage.removeItem(key);
          i--; // 因为removeItem会改变localStorage.length，所以需要减1
        }
      }
    } catch (error) {
      console.error("Failed to clear all conversations from localStorage:", error);
    }
  }
}

interface ConversationState {
  // 状态
  conversations: ConversationSummary[];
  currentConversation: ConversationDetail | null;
  isLoading: boolean;
  sidebarOpen: boolean;

  // 动作
  setSidebarOpen: (open: boolean) => void;
  loadConversations: () => void;
  createNewConversation: (title?: string, firstMessage?: string, mode?: "research" | "chat") => string;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  addMessageToConversation: (conversationId: string, message: ConversationMessage) => void;
  clearCurrentConversation: () => void;
  clearAllConversations: () => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      // 初始状态
      conversations: [],
      currentConversation: null,
      isLoading: false,
      sidebarOpen: true, // 默认打开侧边栏

      // 动作实现
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      loadConversations: () => {
        console.log("Loading conversations from localStorage...");
        set({ isLoading: true });
        
        const conversations = LocalConversationStorage.getConversations();
        console.log("Loaded conversations:", conversations);
        
        // 按更新时间排序（最新的在前）
        const sortedConversations = conversations.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        
        set({ conversations: sortedConversations, isLoading: false });
      },

      createNewConversation: (title?: string, firstMessage?: string, mode: "research" | "chat" = "research") => {
        const conversationId = `conversation-${Date.now()}`;
        const now = new Date().toISOString();
        const conversationTitle = title ?? `新对话 ${new Date().toLocaleString('zh-CN')}`;
        
        // 创建对话详情
        const conversation: ConversationDetail = {
          id: conversationId,
          title: conversationTitle,
          created_at: now,
          updated_at: now,
          mode: mode, // 保存对话模式
          messages: firstMessage ? [{
            id: `msg-${Date.now()}`,
            conversation_id: conversationId,
            thread_id: conversationId,
            role: "user",
            content: firstMessage,
            timestamp: now,
          }] : [],
        };

        // 创建对话摘要
        const conversationSummary: ConversationSummary = {
          id: conversationId,
          title: conversationTitle,
          created_at: now,
          updated_at: now,
          message_count: conversation.messages.length,
          last_message_preview: firstMessage ? 
            (firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "")) : undefined,
          mode: mode, // 保存对话模式
        };

        // 保存到本地存储
        LocalConversationStorage.saveConversationDetail(conversation);
        
        const { conversations } = get();
        const newConversations = [conversationSummary, ...conversations];
        LocalConversationStorage.saveConversations(newConversations);

        // 更新主要的消息store
        const messageStore = useStore.getState();
        messageStore.setConversation(conversationId, conversationId);
        
        // 设置新对话的模式
        messageStore.setCurrentMode(mode);

        set({
          conversations: newConversations,
          currentConversation: conversation,
        });

        return conversationId;
      },

      selectConversation: (conversationId: string) => {
        set({ isLoading: true });
        
        const conversation = LocalConversationStorage.getConversationDetail(conversationId);
        
        if (!conversation) {
          console.error(`Conversation ${conversationId} not found`);
          set({ isLoading: false });
          return;
        }
        
        // 更新主要的消息store
        const messageStore = useStore.getState();
        
        // 先清空当前消息，然后设置新的对话
        messageStore.clearConversation();
        messageStore.setConversation(conversationId, conversationId);
        
        // 将历史消息加载到消息系统中
        if (conversation.messages.length > 0) {
          const convertedMessages = conversation.messages.map(msg => ({
            id: msg.id,
            threadId: msg.thread_id,
            role: msg.role as "user" | "assistant" | "tool",
            agent: msg.agent as "coordinator" | "planner" | "researcher" | "coder" | "reporter" | "podcast" | undefined,
            content: msg.content,
            contentChunks: [msg.content], // 简单处理，将整个内容作为一个chunk
            isStreaming: false, // 历史消息都是完成状态
            toolCalls: msg.metadata?.toolCalls as Array<{id: string; name: string; args: Record<string, unknown>; argsChunks?: string[]; result?: string}> | undefined,
            options: msg.metadata?.options as Array<{text: string; value: string}> | undefined, // 恢复 interrupt 消息的 options 数据
            finishReason: msg.metadata?.finishReason as "stop" | "interrupt" | "tool_calls" | undefined, // 恢复 finishReason 用于识别 interrupt 消息
          }));
          
          // 逐个添加消息到消息系统
          convertedMessages.forEach(message => {
            messageStore.appendMessage(message);
          });
        }
        
        // 恢复对话模式
        const conversationMode = conversation.mode ?? "research"; // 默认研究模式
        messageStore.setCurrentMode(conversationMode);
        
        set({ currentConversation: conversation, isLoading: false });
      },

      deleteConversation: (conversationId: string) => {
        const { conversations, currentConversation } = get();
        
        // 从本地存储删除
        LocalConversationStorage.deleteConversationDetail(conversationId);
        
        const newConversations = conversations.filter(c => c.id !== conversationId);
        LocalConversationStorage.saveConversations(newConversations);

        set({
          conversations: newConversations,
          currentConversation: currentConversation?.id === conversationId 
            ? null 
            : currentConversation,
        });
      },

      updateConversationTitle: (conversationId: string, title: string) => {
        const { conversations, currentConversation } = get();
        const now = new Date().toISOString();
        
        // 更新对话详情
        const conversation = LocalConversationStorage.getConversationDetail(conversationId);
        if (conversation) {
          const updatedConversation = {
            ...conversation,
            title,
            updated_at: now,
          };
          LocalConversationStorage.saveConversationDetail(updatedConversation);
          
          // 更新状态中的当前对话
          if (currentConversation?.id === conversationId) {
            set({ currentConversation: updatedConversation });
          }
        }
        
        // 更新对话列表
        const newConversations = conversations.map(c =>
          c.id === conversationId ? { ...c, title, updated_at: now } : c
        );
        LocalConversationStorage.saveConversations(newConversations);

        set({ conversations: newConversations });
      },

      addMessageToConversation: (conversationId: string, message: ConversationMessage) => {
        const { conversations } = get();
        const conversation = LocalConversationStorage.getConversationDetail(conversationId);
        
        if (!conversation) {
          console.error(`Conversation ${conversationId} not found`);
          return;
        }
        
        // 更新对话详情
        const updatedConversation = {
          ...conversation,
          messages: [...conversation.messages, message],
          updated_at: new Date().toISOString(),
        };
        LocalConversationStorage.saveConversationDetail(updatedConversation);
        
        // 更新对话摘要
        const updatedSummary: ConversationSummary = {
          id: conversationId,
          title: conversation.title,
          created_at: conversation.created_at,
          updated_at: updatedConversation.updated_at,
          message_count: updatedConversation.messages.length,
          last_message_preview: message.content ? 
            (message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")) : 
            (message.metadata?.options ? "[选项消息]" : "[空消息]"),
          mode: conversation.mode, // 保留对话模式
        };
        
        const updatedConversations = conversations.map(c =>
          c.id === conversationId ? updatedSummary : c
        );
        LocalConversationStorage.saveConversations(updatedConversations);
        
        // 重新排序（按更新时间）
        const sortedConversations = updatedConversations.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        
        // 更新状态
        const currentConv = get().currentConversation;
        set({ 
          conversations: sortedConversations,
          // 只有当更新的对话是当前对话时，才更新currentConversation
          currentConversation: currentConv?.id === conversationId ? updatedConversation : currentConv,
        });
      },

      clearCurrentConversation: () => {
        // 清空消息store
        const messageStore = useStore.getState();
        messageStore.clearConversation();
        
        set({ currentConversation: null });
      },

      clearAllConversations: () => {
        // 清空本地存储
        LocalConversationStorage.clearAllConversations();
        
        // 清空当前消息store
        const messageStore = useStore.getState();
        messageStore.clearConversation();
        
        // 重置状态
        set({
          conversations: [],
          currentConversation: null,
        });
      },
    }),
    {
      name: "conversation-storage",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        conversations: state.conversations,
        // 持久化对话列表和侧边栏状态
      }),
    }
  )
);

// 监听来自conversation-api的更新事件
if (typeof window !== 'undefined') {
  window.addEventListener('conversation-updated', () => {
    // 重新加载对话列表以保持同步
    useConversationStore.getState().loadConversations();
  });
}