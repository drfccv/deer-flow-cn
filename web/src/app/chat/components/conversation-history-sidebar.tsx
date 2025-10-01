// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { MessageSquare, Plus, MoreHorizontal, Edit2, Trash2, X, Menu, Trash } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";


import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useConversationStore } from "~/core/conversation-store";
import type { ConversationSummary } from "~/core/conversation-types";
import { cn } from "~/lib/utils";

interface ConversationHistorySidebarProps {
  className?: string;
}

export function ConversationHistorySidebar({ className }: ConversationHistorySidebarProps) {
  const {
    conversations,
    currentConversation,
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    loadConversations,
    createNewConversation,
    selectConversation,
    deleteConversation,
    updateConversationTitle,
    clearCurrentConversation,
    clearAllConversations,
  } = useConversationStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  // 浮动按钮位置状态
  const [floatingButtonPos, setFloatingButtonPos] = useState({ x: 8, y: 64 }); // 默认 left-2 top-16
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number }>({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0
  });

  // 加载对话列表
  useEffect(() => {
    if (sidebarOpen) {
      loadConversations();
    }
  }, [sidebarOpen, loadConversations]);

  // 组件挂载时也尝试加载
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // 加载保存的浮动按钮位置
  useEffect(() => {
    const savedPos = localStorage.getItem('floating-button-position');
    if (savedPos) {
      try {
        const pos = JSON.parse(savedPos);
        setFloatingButtonPos(pos);
      } catch (error) {
        console.error('Failed to load floating button position:', error);
      }
    }
  }, []);

  // 保存浮动按钮位置
  useEffect(() => {
    localStorage.setItem('floating-button-position', JSON.stringify(floatingButtonPos));
  }, [floatingButtonPos]);

  const handleNewConversation = () => {
    try {
      clearCurrentConversation();
      createNewConversation(
        `新对话 ${new Date().toLocaleString()}`,
        undefined // 不自动添加第一条消息
      );
      
      // 只在移动端关闭侧边栏，桌面端保持打开状态
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    if (currentConversation?.id === conversationId) return;
    
    try {
      selectConversation(conversationId);
      
      // 只在移动端关闭侧边栏，桌面端保持打开状态
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to select conversation:", error);
    }
  };

  const handleEditStart = (conversation: ConversationSummary) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleEditSave = (conversationId: string) => {
    if (editTitle.trim()) {
      try {
        updateConversationTitle(conversationId, editTitle.trim());
        setEditingId(null);
      } catch (error) {
        console.error("Failed to update conversation title:", error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = (conversationId: string) => {
    try {
      deleteConversation(conversationId);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleClearAllConversations = () => {
    try {
      clearAllConversations();
      setShowClearDialog(false);
    } catch (error) {
      console.error("Failed to clear all conversations:", error);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff / (1000 * 60));

      if (days > 0) {
        return `${days}天前`;
      } else if (hours > 0) {
        return `${hours}小时前`;
      } else if (minutes > 0) {
        return `${minutes}分钟前`;
      } else {
        return "刚刚";
      }
    } catch {
      return "未知时间";
    }
  };

  // 浮动按钮拖拽处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setHasMoved(false);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: floatingButtonPos.x,
      startPosY: floatingButtonPos.y
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    setHasMoved(false);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: floatingButtonPos.x,
      startPosY: floatingButtonPos.y
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    // 检测是否有实际移动（超过3px阈值）
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      setHasMoved(true);
    }
    
    const newX = Math.max(8, Math.min(window.innerWidth - 56, dragRef.current.startPosX + deltaX));
    const newY = Math.max(8, Math.min(window.innerHeight - 56, dragRef.current.startPosY + deltaY));
    
    setFloatingButtonPos({ x: newX, y: newY });
  }, [isDragging]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const deltaX = touch.clientX - dragRef.current.startX;
    const deltaY = touch.clientY - dragRef.current.startY;
    
    // 检测是否有实际移动（超过3px阈值）
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      setHasMoved(true);
    }
    
    const newX = Math.max(8, Math.min(window.innerWidth - 56, dragRef.current.startPosX + deltaX));
    const newY = Math.max(8, Math.min(window.innerHeight - 56, dragRef.current.startPosY + deltaY));
    
    setFloatingButtonPos({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 添加全局鼠标和触摸事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      // 防止页面滚动和文本选择
      document.body.style.userSelect = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        
        // 恢复页面正常行为
        document.body.style.userSelect = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove]);

  return (
    <>
      {/* 移动端浮动展开按钮 - 当侧边栏关闭时显示 */}
      {!sidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            // 防止拖拽时触发点击 - 只有没有移动时才算点击
            if (!hasMoved) {
              setSidebarOpen(true);
            }
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={cn(
            "fixed z-50 h-12 w-12 sm:hidden rounded-2xl shadow-lg bg-background/90 backdrop-blur-sm border-2 transition-shadow duration-200",
            isDragging ? "cursor-grabbing shadow-xl scale-105" : "cursor-grab hover:shadow-xl"
          )}
          style={{
            left: `${floatingButtonPos.x}px`,
            top: `${floatingButtonPos.y}px`,
          }}
          title={isDragging ? "拖拽调整位置" : "展开侧边栏"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      {/* 移动端遮罩 - 优化竖屏体验 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 侧边栏 */}
      <div
        className={cn(
          "bg-background/95 backdrop-blur-md border border-border flex flex-col transition-all duration-300 ease-in-out shadow-lg will-change-transform",
          // 固定定位，悬浮样式，避开header
          "fixed z-50 rounded-lg box-border overflow-hidden",
          // 移动端和桌面端适应
          sidebarOpen 
            ? "left-2 right-2 top-14 h-[calc(100vh-64px)] w-auto sm:left-2 sm:right-auto sm:w-80" // 移动端全宽减去边距，桌面端固定宽度
            : "w-0 sm:w-16 sm:left-2 sm:top-14 sm:h-[calc(100vh-64px)] overflow-hidden sm:overflow-visible",
          className
        )}
        style={{
          maxWidth: sidebarOpen ? 'calc(100vw - 16px)' : undefined,
          minWidth: '0'
        }}
      >
        {/* 头部 */}
        <div className={cn(
          "flex items-center border-b border-border transition-all duration-300",
          "h-14 min-h-[56px]", // 固定头部高度
          sidebarOpen ? "justify-between px-4" : "justify-center p-2 md:p-3"
        )}>
          <h2 className={cn(
            "font-semibold text-lg truncate transition-all duration-300",
            sidebarOpen 
              ? "opacity-100 translate-x-0" 
              : "opacity-0 -translate-x-2 w-0 overflow-hidden"
          )}>
            对话历史
          </h2>
          {sidebarOpen ? (
            <div className={cn(
              "flex items-center gap-1 h-8 transition-all duration-300",
              "opacity-100 translate-x-0"
            )}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewConversation}
                className="h-8 w-8 rounded-2xl touch-manipulation"
                title="新建对话"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-2xl touch-manipulation"
                    title="清空所有对话"
                    disabled={conversations.length === 0}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>确认清空</DialogTitle>
                    <DialogDescription>
                      您确定要清空所有对话历史吗？此操作将永久删除所有对话记录，且无法恢复。
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowClearDialog(false)}
                    >
                      取消
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleClearAllConversations}
                    >
                      确认清空
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 rounded-2xl touch-manipulation"
                title="收起侧边栏"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="h-8 w-8 hidden sm:flex rounded-2xl touch-manipulation"
                title="展开侧边栏"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 对话列表 */}
        <ScrollArea 
          className={cn(
            "transition-all duration-300 overscroll-contain",
            sidebarOpen ? "flex-1 block overflow-y-auto" : "flex-1 p-1 md:p-2 hidden md:block",
            // 添加特定class来覆盖ScrollArea内部样式
            "[&>div]:!block [&>div]:!w-full [&>div]:!max-w-full [&>div]:!min-w-0"
          )}
          style={{
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            padding: sidebarOpen ? '8px 12px' : undefined,
            overflow: 'hidden', // 强制隐藏溢出内容
            height: sidebarOpen ? 'calc(100% - 56px)' : 'calc(100% - 56px)' // 减去固定头部高度
          }}
        >
          {!sidebarOpen ? (
            // 收起状态：在桌面端显示快捷操作按钮
            <div className="hidden md:flex flex-col items-center py-4 space-y-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewConversation}
                className="h-10 w-10 rounded-2xl"
                title="新建对话"
              >
                <Plus className="h-5 w-5" />
              </Button>
              {conversations.slice(0, 3).map((conversation) => (
                <Button
                  key={conversation.id}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={cn(
                    "h-10 w-10 text-xs rounded-2xl",
                    currentConversation?.id === conversation.id && "bg-accent"
                  )}
                  title={conversation.title}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              ))}
            </div>
          ) : (
            <div 
              className={cn(
                "w-full transition-opacity duration-300",
                sidebarOpen ? "opacity-100" : "opacity-0"
              )}
              style={{
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >

              
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  加载中...
                </div>
              ) : !conversations || conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <p className="text-center mb-4">
                    欢迎使用 DeerFlow-CN！<br/>
                    开始您的第一次AI对话
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewConversation}
                    className="mt-2 rounded-2xl"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    开始新对话
                  </Button>
                </div>
              ) : (
                <div 
                  className="space-y-1" 
                  style={{ 
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden', // 确保内容不会超出容器
                    display: 'block', // 覆盖可能的table布局
                    minWidth: '0', // 允许收缩
                    overflowWrap: 'break-word' // 长单词自动换行
                  }}
                >
                  {conversations.map((conversation) => (
                        <div
                  key={conversation.id}
                  className={cn(
                    "group relative rounded-2xl cursor-pointer transition-colors",
                    "overflow-hidden",
                    "hover:bg-accent/50",
                    currentConversation?.id === conversation.id
                      ? "bg-accent border border-accent-foreground/20 shadow-sm"
                      : "hover:bg-accent/30"
                  )}
                  style={{ 
                    width: '100%',
                    maxWidth: '100%', 
                    padding: '12px',
                    boxSizing: 'border-box',
                    overflow: 'hidden', // 强制裁剪超出内容
                    display: 'block', // 确保为块级元素
                    minWidth: '0' // 允许收缩到最小宽度
                  }}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  {editingId === conversation.id ? (
                    <div className="space-y-2 w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEditSave(conversation.id);
                          } else if (e.key === "Escape") {
                            handleEditCancel();
                          }
                        }}
                        className="h-8 text-sm rounded-2xl w-full"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSave(conversation.id)}
                          className="h-6 px-2 text-xs rounded-2xl"
                        >
                          保存
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleEditCancel}
                          className="h-6 px-2 text-xs rounded-2xl"
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="flex items-start justify-between overflow-hidden"
                        style={{ 
                          width: '100%', 
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                          gap: '8px'
                        }}
                      >
                        <div 
                          className="overflow-hidden"
                          style={{ 
                            flex: '1 1 0%',
                            minWidth: '0',
                            maxWidth: 'calc(100% - 32px)', // 为操作按钮预留空间
                            boxSizing: 'border-box',
                            overflow: 'hidden' // 确保文本不会超出
                          }}
                        >
                          <h3 
                            className="font-medium text-sm mb-1" 
                            style={{ 
                              maxWidth: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              wordBreak: 'break-word'
                            }}
                          >
                            {conversation.title}
                          </h3>
                          {conversation.last_message_preview && (
                            <p 
                              className="text-xs text-muted-foreground mb-1" 
                              style={{ 
                                maxWidth: '100%',
                                boxSizing: 'border-box',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical' as React.CSSProperties['WebkitBoxOrient'],
                                lineHeight: '1.4',
                                maxHeight: '2.8em', // 限制为2行
                                wordBreak: 'break-word'
                              }}
                            >
                              {conversation.last_message_preview}
                            </p>
                          )}
                          <div 
                            className="flex items-center text-xs text-muted-foreground overflow-hidden" 
                            style={{ 
                              width: '100%',
                              gap: '4px',
                              boxSizing: 'border-box'
                            }}
                          >
                            <span className="flex-shrink-0">{conversation.message_count} 条消息</span>
                            <span className="flex-shrink-0">•</span>
                            <span 
                              style={{ 
                                flex: '1 1 0%',
                                minWidth: '0', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap' 
                              }}
                            >
                              {formatTime(conversation.updated_at)}
                            </span>
                          </div>
                        </div>
                        
                        <div 
                          className="flex-shrink-0 flex justify-center items-start" 
                          style={{ 
                            width: '24px', 
                            minWidth: '24px',
                            maxWidth: '24px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded-2xl cursor-pointer active:scale-105"
                                onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(conversation);
                              }}
                            >
                              <Edit2 className="h-3 w-3 mr-2" />
                              重命名
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(conversation.id);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}