// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { MultiAgentVisualization } from "../components/multi-agent-visualization";
import { SectionHeader } from "../components/section-header";

export function MultiAgentSection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center">
      <SectionHeader
        anchor="multi-agent-architecture"
        title="多智能体架构"
        description="体验 Supervisor + Handoffs 设计模式下的智能体协作。"
      />
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <div className="h-full w-full">
          <MultiAgentVisualization />
        </div>
      </div>
    </section>
  );
}
