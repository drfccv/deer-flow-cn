// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import type {
  ConversationSummary,
  ConversationDetail,
  CreateConversationRequest,
  UpdateConversationRequest,
  ConversationMessage,
} from "./conversation-types";

// 本地存储键名
const CONVERSATIONS_STORAGE_KEY = "deer-flow-conversations";
const CONVERSATION_DETAILS_STORAGE_KEY = "deer-flow-conversation-details";

class ConversationAPI {
  // 获取对话列表
  getConversations(limit = 50, offset = 0): ConversationSummary[] {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      const conversations: ConversationSummary[] = stored ? JSON.parse(stored) : [];
      
      // 按更新时间排序（最新的在前）
      const sortedConversations = conversations.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      
      // 应用分页
      return sortedConversations.slice(offset, offset + limit);
    } catch (error) {
      console.error("Failed to get conversations from localStorage:", error);
      return [];
    }
  }

  // 获取特定对话详情
  getConversation(conversationId: string): ConversationDetail | null {
    try {
      const stored = localStorage.getItem(`${CONVERSATION_DETAILS_STORAGE_KEY}-${conversationId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to get conversation from localStorage:", error);
      return null;
    }
  }

  // 创建新对话
  createConversation(request: CreateConversationRequest): ConversationDetail {
    const conversationId = `conversation-${Date.now()}`;
    const now = new Date().toISOString();
    const conversationTitle = request.title || `新对话 ${new Date().toLocaleString('zh-CN')}`;
    
    // 创建对话详情
    const conversation: ConversationDetail = {
      id: conversationId,
      title: conversationTitle,
      created_at: now,
      updated_at: now,
      mode: request.mode || "research", // 默认为研究模式
      messages: request.first_message ? [{
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        thread_id: conversationId,
        role: "user",
        content: request.first_message,
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
      last_message_preview: request.first_message ? 
        (request.first_message.slice(0, 50) + (request.first_message.length > 50 ? "..." : "")) 
        : undefined,
      mode: request.mode || "research", // 默认为研究模式
    };

    try {
      // 保存对话详情
      localStorage.setItem(
        `${CONVERSATION_DETAILS_STORAGE_KEY}-${conversationId}`,
        JSON.stringify(conversation)
      );
      
      // 更新对话列表
      const existingConversations = this.getConversations();
      const newConversations = [conversationSummary, ...existingConversations];
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(newConversations));
      
      return conversation;
    } catch (error) {
      console.error("Failed to create conversation in localStorage:", error);
      throw new Error("Failed to create conversation");
    }
  }

  // 更新对话
  updateConversation(
    conversationId: string,
    request: UpdateConversationRequest
  ): ConversationDetail | null {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return null;
    }

    const now = new Date().toISOString();
    const updatedConversation = {
      ...conversation,
      ...request,
      updated_at: now,
    };

    try {
      // 保存更新的对话详情
      localStorage.setItem(
        `${CONVERSATION_DETAILS_STORAGE_KEY}-${conversationId}`,
        JSON.stringify(updatedConversation)
      );
      
      // 更新对话列表中的摘要
      const conversations = this.getConversations();
      const updatedConversations = conversations.map(c =>
        c.id === conversationId 
          ? { ...c, ...request, updated_at: now }
          : c
      );
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updatedConversations));
      
      return updatedConversation;
    } catch (error) {
      console.error("Failed to update conversation in localStorage:", error);
      return null;
    }
  }

  // 删除对话
  deleteConversation(conversationId: string): boolean {
    try {
      // 删除对话详情
      localStorage.removeItem(`${CONVERSATION_DETAILS_STORAGE_KEY}-${conversationId}`);
      
      // 从对话列表中移除
      const conversations = this.getConversations();
      const filteredConversations = conversations.filter(c => c.id !== conversationId);
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(filteredConversations));
      
      return true;
    } catch (error) {
      console.error("Failed to delete conversation from localStorage:", error);
      return false;
    }
  }

  // 向对话添加消息
  addMessageToConversation(conversationId: string, message: ConversationMessage): ConversationDetail | null {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      console.error('Conversation not found:', conversationId);
      return null;
    }

    // 检查消息是否已存在（防止重复添加）
    const messageExists = conversation.messages.some(existingMessage => existingMessage.id === message.id);
    if (messageExists) {
      return conversation;
    }

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, message],
      updated_at: new Date().toISOString(),
    };

    try {
      // 保存更新的对话详情
      localStorage.setItem(
        `${CONVERSATION_DETAILS_STORAGE_KEY}-${conversationId}`,
        JSON.stringify(updatedConversation)
      );
      
      // 更新对话列表中的摘要
      const conversations = this.getConversations();
      const updatedConversations = conversations.map(c =>
        c.id === conversationId 
          ? { 
              ...c, 
              message_count: updatedConversation.messages.length,
              last_message_preview: message.content ? 
                (message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")) :
                (message.metadata?.options ? "[选项消息]" : "[空消息]"),
              updated_at: updatedConversation.updated_at,
              mode: updatedConversation.mode, // 保留对话模式
            }
          : c
      );
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(updatedConversations));
      
      // 通知 conversation store 重新加载数据以保持同步
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('conversation-updated'));
      }
      
      return updatedConversation;
    } catch (error) {
      console.error("Failed to add message to conversation in localStorage:", error);
      return null;
    }
  }
}

export const conversationAPI = new ConversationAPI();