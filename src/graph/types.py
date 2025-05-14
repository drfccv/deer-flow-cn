# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: MIT

import operator
from typing import Annotated

from langgraph.graph import MessagesState

from src.prompts.planner_model import Plan


class State(MessagesState):
    """智能体系统的全局状态，继承自 MessagesState，扩展多种运行时变量。"""

    # 运行时变量
    locale: str = "zh-CN"  # 当前对话语言，默认中文
    observations: list[str] = []  # 研究过程中的观察/补充信息
    plan_iterations: int = 0  # 规划迭代次数
    current_plan: Plan | str = None  # 当前研究计划
    final_report: str = ""  # 最终报告内容
    auto_accepted_plan: bool = False  # 是否自动接受计划
    enable_background_investigation: bool = True  # 是否启用背景调查
    background_investigation_results: str = None  # 背景调查结果
    mode: str = "research"  # 对话模式，支持 chat/research
