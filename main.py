# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: MIT

"""
Entry point script for the DeerFlow project.
"""

import argparse
import asyncio

from InquirerPy import inquirer

from src.config.questions import BUILT_IN_QUESTIONS, BUILT_IN_QUESTIONS_ZH_CN
from src.workflow import run_agent_workflow_async


def ask(
    question,
    debug=False,
    max_plan_iterations=1,
    max_step_num=3,
    enable_background_investigation=True,
):
    """Run the agent workflow with the given question.

    Args:
        question: The user's query or request
        debug: If True, enables debug level logging
        max_plan_iterations: Maximum number of plan iterations
        max_step_num: Maximum number of steps in a plan
        enable_background_investigation: If True, performs web search before planning to enhance context
    """
    asyncio.run(
        run_agent_workflow_async(
            user_input=question,
            debug=debug,
            max_plan_iterations=max_plan_iterations,
            max_step_num=max_step_num,
            enable_background_investigation=enable_background_investigation,
        )
    )


def main(
    debug=False,
    max_plan_iterations=1,
    max_step_num=3,
    enable_background_investigation=True,
):
    """Interactive mode with built-in questions.

    Args:
        enable_background_investigation: If True, performs web search before planning to enhance context
        debug: If True, enables debug level logging
        max_plan_iterations: Maximum number of plan iterations
        max_step_num: Maximum number of steps in a plan
    """
    # First select language
    language = inquirer.select(
        message="选择语言 / Select language:",
        choices=["中文", "English"],
    ).execute()

    # Choose questions based on language
    questions = (
        BUILT_IN_QUESTIONS_ZH_CN if language == "中文" else BUILT_IN_QUESTIONS
    )
    ask_own_option = (
        "[自定义问题]" if language == "中文" else "[Ask my own question]"
    )

    # Select a question
    initial_question = inquirer.select(
        message=(
            "您想了解什么?" if language == "中文" else "What do you want to know?"
        ),
        choices=[ask_own_option] + questions,
    ).execute()

    if initial_question == ask_own_option:
        initial_question = inquirer.text(
            message=(
                "您想了解什么?"
                if language == "中文"
                else "What do you want to know?"
            ),
        ).execute()

    # Pass all parameters to ask function
    ask(
        question=initial_question,
        debug=debug,
        max_plan_iterations=max_plan_iterations,
        max_step_num=max_step_num,
        enable_background_investigation=enable_background_investigation,
    )


if __name__ == "__main__":
    # Set up argument parser
    parser = argparse.ArgumentParser(description="运行 Deer")
    parser.add_argument("query", nargs="*", help="要处理的查询")
    parser.add_argument(
        "--interactive",
        action="store_true",
        help="使用内置问题运行交互模式",
    )
    parser.add_argument(
        "--max_plan_iterations",
        type=int,
        default=1,
        help="最大计划迭代次数（默认：1）",
    )
    parser.add_argument(
        "--max_step_num",
        type=int,
        default=3,
        help="计划中的最大步骤数（默认：3）",
    )
    parser.add_argument("--debug", action="store_true", help="启用调试日志")
    parser.add_argument(
        "--no-background-investigation",
        action="store_false",
        dest="enable_background_investigation",
        help="禁用计划前的背景调查",
    )

    args = parser.parse_args()

    if args.interactive:
        # Pass command line arguments to main function
        main(
            debug=args.debug,
            max_plan_iterations=args.max_plan_iterations,
            max_step_num=args.max_step_num,
            enable_background_investigation=args.enable_background_investigation,
        )
    else:
        # Parse user input from command line arguments or user input
        if args.query:
            user_query = " ".join(args.query)
        else:
            user_query = input("请输入您的查询: ")

        # Run the agent workflow with the provided parameters
        ask(
            question=user_query,
            debug=args.debug,
            max_plan_iterations=args.max_plan_iterations,
            max_step_num=args.max_step_num,
            enable_background_investigation=args.enable_background_investigation,
        )
