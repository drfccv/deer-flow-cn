# prompt_manager.py
# 用于管理prompt的后端工具，支持获取、保存、列出prompt
import os
import json
import glob
from typing import List

PROMPT_FILE = os.path.join(os.path.dirname(__file__), 'user_prompts.json')
DEFAULT_PROMPTS = [
    {"name": "默认对话模式", "content": "你是 DeerFlow，一名友好、自然的中文对话助手。当前为对话模式，所有输入都直接回复，不允许交由规划器或任何工具处理。"},
    {"name": "研究模式", "content": "你是一位专业的深度研究员。通过使用专业代理团队来研究和规划信息收集任务，以获取全面的数据。"}
]

CHAT_PROMPT_DIR = os.path.join(os.path.dirname(__file__), '../prompts/chat')
CHAT_PROMPT_DIR = os.path.abspath(CHAT_PROMPT_DIR)

def load_prompts() -> List[dict]:
    if not os.path.exists(PROMPT_FILE):
        save_prompts(DEFAULT_PROMPTS)  # 若文件不存在则写入默认prompt
        return DEFAULT_PROMPTS
    try:
        with open(PROMPT_FILE, 'r', encoding='utf-8') as f:
            prompts = json.load(f)
            # 若文件为空或格式不对，自动补充默认prompt
            if not isinstance(prompts, list) or not prompts:
                save_prompts(DEFAULT_PROMPTS)
                return DEFAULT_PROMPTS
            return prompts
    except Exception:
        save_prompts(DEFAULT_PROMPTS)
        return DEFAULT_PROMPTS

def save_prompts(prompts: List[dict]):
    with open(PROMPT_FILE, 'w', encoding='utf-8') as f:
        json.dump(prompts, f, ensure_ascii=False, indent=2)

def add_prompt(prompt: dict):
    prompts = load_prompts()
    # 避免重名，若已存在则覆盖
    prompts = [p for p in prompts if p['name'] != prompt['name']]
    prompts.append(prompt)
    save_prompts(prompts)

def get_prompt_by_name(name: str) -> dict:
    prompts = load_prompts()
    for p in prompts:
        if p['name'] == name:
            return p
    return None

def list_chat_prompt_files() -> list:
    # 查找 chat 目录下所有 md 文件
    files = glob.glob(os.path.join(CHAT_PROMPT_DIR, '*.md'))
    result = []
    for f in files:
        try:
            name = os.path.splitext(os.path.basename(f))[0]
            # 文件名强制utf-8解码
            name = name.encode('utf-8').decode('utf-8')
            with open(f, 'r', encoding='utf-8') as fp:
                content = fp.read()
        except Exception:
            with open(f, 'r', encoding='gbk', errors='ignore') as fp:
                content = fp.read()
        result.append({'name': name, 'content': content, 'path': f})
    return result
