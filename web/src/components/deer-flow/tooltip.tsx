// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import type { CSSProperties } from "react";

import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export function Tooltip({
  className,
  style,
  children,
  title,
  open,
  side,
  sideOffset,
}: {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  title?: React.ReactNode;
  open?: boolean;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
}) {
  return (
    <TooltipProvider>
      <ShadcnTooltip delayDuration={750} open={open}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(className)}
          style={style}
          side={side}
          sideOffset={sideOffset}
        >
          {title}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
