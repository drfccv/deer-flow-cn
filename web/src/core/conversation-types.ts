// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_preview?: string;
  mode?: "research" | "chat"; // 对话模式：研究模式或聊天模式
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ConversationDetail {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ConversationMessage[];
  mode?: "research" | "chat"; // 对话模式：研究模式或聊天模式
}

export interface CreateConversationRequest {
  title?: string;
  first_message?: string;
  mode?: "research" | "chat";
}

export interface UpdateConversationRequest {
  title?: string;
}

export interface ConversationListResponse {
  conversations: ConversationSummary[];
  total: number;
}

export interface ConversationResponse {
  conversation: ConversationDetail;
}