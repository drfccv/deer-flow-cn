// 对话模式Prompt管理Tab
import { Wand2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import type { Tab } from "./types";

// 读取后端API地址
const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

export const PromptTab: Tab = ({ onChange }) => {
  const [prompts, setPrompts] = useState<{ name: string; content: string }[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customName, setCustomName] = useState("");
  // 新增：activePromptType 记录当前激活类型
  const [activePromptType, setActivePromptType] = useState<'builtin' | 'custom'>("builtin");
  const loadedRef = useRef(false);

  // 自动恢复localStorage中的自定义Prompt和类型，只在首次加载时执行
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const savedCustomPrompt = localStorage.getItem("chat_custom_prompt");
    const savedCustomName = localStorage.getItem("chat_custom_prompt_name");
    const savedPromptType = localStorage.getItem("chat_prompt_type");
    const savedBuiltinName = localStorage.getItem("chat_builtin_prompt_name");
    if (savedCustomPrompt) setCustomPrompt(savedCustomPrompt);
    if (savedCustomName) setCustomName(savedCustomName);
    if (savedPromptType === "custom" && savedCustomPrompt) {
      setActivePromptType("custom");
      setSelected("");
      onChange({ prompt: savedCustomPrompt });
      return;
    }
    // 否则恢复内置prompt
    setActivePromptType("builtin");
    if (savedBuiltinName) setSelected(savedBuiltinName);
  }, [onChange]);

  useEffect(() => {
    void fetch(`${apiBase}/prompt/chat-list`).then(async (res) => {
      const data = await res.json();
      setPrompts(Array.isArray(data.prompts) ? data.prompts : []);
      // 默认选中“标准模式”或第一个
      if (Array.isArray(data.prompts) && data.prompts.length > 0 && !selected) {
        const defaultName = data.prompts.find((p: { name: string }) => p.name === "标准模式")?.name ?? data.prompts[0].name;
        setSelected(defaultName);
        if (activePromptType === "builtin") {
          onChange({ prompt: data.prompts.find((p: { name: string }) => p.name === defaultName)?.content });
        }
      }
    });
  }, [onChange, activePromptType, selected]);

  // 切换内置prompt
  const handleSelect = (name: string) => {
    setSelected(name);
    setActivePromptType("builtin");
    localStorage.setItem("chat_prompt_type", "builtin");
    localStorage.setItem("chat_builtin_prompt_name", name);
    const p = prompts.find((p) => p.name === name);
    if (p) {
      onChange({ prompt: p.content });
    }
  };

  // 切换到自定义prompt
  const handleUseCustom = () => {
    if (!customPrompt) return;
    setActivePromptType("custom");
    setSelected("");
    localStorage.setItem("chat_prompt_type", "custom");
    onChange({ prompt: customPrompt });
  };

  const handleCustomSave = () => {
    if (!customName || !customPrompt) return;
    setPrompts([...prompts, { name: customName, content: customPrompt }]);
    setSelected(customName);
    setActivePromptType("custom");
    setCustomName("");
    setCustomPrompt("");
    onChange({ prompt: customPrompt });
    localStorage.setItem("chat_custom_prompt", customPrompt);
    localStorage.setItem("chat_custom_prompt_name", customName);
    localStorage.setItem("chat_prompt_type", "custom");
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
    localStorage.setItem("chat_custom_prompt", e.target.value);
  };
  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomName(e.target.value);
    localStorage.setItem("chat_custom_prompt_name", e.target.value);
  };

  return (
    <div className="space-y-4" style={{ fontFamily: 'PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif' }}>
      <div>
        <div className="font-semibold mb-2">选择已有Prompt：</div>
        <div className="flex flex-wrap gap-2">
          {prompts.map((p) => (
            <Button
              key={p.name}
              variant={activePromptType === "builtin" && selected === p.name ? "default" : "outline"}
              onClick={() => handleSelect(p.name)}
            >
              {p.name}
            </Button>
          ))}
          <Button
            variant={activePromptType === "custom" ? "default" : "outline"}
            onClick={handleUseCustom}
            className="ml-2"
            disabled={!customPrompt}
          >
            使用自定义Prompt
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <div className="font-semibold mb-2">自定义Prompt：</div>
        <Input
          placeholder="自定义名称"
          value={customName}
          onChange={handleCustomNameChange}
          className="mb-2"
        />
        <Textarea
          placeholder="输入你的Prompt内容..."
          value={customPrompt}
          onChange={handleCustomPromptChange}
          rows={4}
        />
        <Button className="mt-2" onClick={handleCustomSave}>
          保存自定义Prompt
        </Button>
      </div>
    </div>
  );
};
PromptTab.displayName = "提示词";
PromptTab.tabId = "prompt-preset";
PromptTab.icon = Wand2;
