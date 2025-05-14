// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

export const playbook = {
  steps: [
    {
      description:
        "协调员负责与用户沟通，理解其问题和需求。",
      activeNodes: ["Start", "Coordinator"],
      activeEdges: ["Start->Coordinator"],
      tooltipPosition: "right",
    },
    {
      description:
        "如果用户的问题已明确定义，协调员将其交给规划员。",
      activeNodes: ["Coordinator", "Planner"],
      activeEdges: ["Coordinator->Planner"],
      tooltipPosition: "left",
    },
    {
      description: "等待人工反馈以完善计划。",
      activeNodes: ["Planner", "HumanFeedback"],
      activeEdges: ["Planner->HumanFeedback"],
      tooltipPosition: "left",
    },
    {
      description: "根据人工反馈更新计划。",
      activeNodes: ["HumanFeedback", "Planner"],
      activeEdges: ["HumanFeedback->Planner"],
      tooltipPosition: "left",
    },
    {
      description:
        "研究团队负责执行核心研究任务。",
      activeNodes: ["Planner", "HumanFeedback", "ResearchTeam"],
      activeEdges: [
        "Planner->HumanFeedback",
        "HumanFeedback->ResearchTeam",
        "ResearchTeam->HumanFeedback",
      ],
      tooltipPosition: "left",
    },
    {
      description:
        "研究员利用搜索和爬虫工具收集信息。",
      activeNodes: ["ResearchTeam", "Researcher"],
      activeEdges: ["ResearchTeam->Researcher", "Researcher->ResearchTeam"],
      tooltipPosition: "left",
    },
    {
      description:
        "程序员负责编写 Python 代码，解决数学、数据分析等问题。",
      tooltipPosition: "right",
      activeNodes: ["ResearchTeam", "Coder"],
      activeEdges: ["ResearchTeam->Coder", "Coder->ResearchTeam"],
    },
    {
      description:
        "研究任务完成后，研究员将结果交给规划员。",
      activeNodes: ["ResearchTeam", "Planner"],
      activeEdges: ["ResearchTeam->Planner"],
      tooltipPosition: "left",
    },
    {
      description:
        "如无需补充信息，规划员将任务交给报告员。",
      activeNodes: ["Reporter", "Planner"],
      activeEdges: ["Planner->Reporter"],
      tooltipPosition: "right",
    },
    {
      description:
        "报告员负责撰写总结报告。",
      activeNodes: ["End", "Reporter"],
      activeEdges: ["Reporter->End"],
      tooltipPosition: "bottom",
    },
  ],
};
