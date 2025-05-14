// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { GithubOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";

import { Logo } from "../../components/deer-flow/logo";
import { ThemeToggle } from "../../components/deer-flow/theme-toggle";
import { Tooltip } from "../../components/deer-flow/tooltip";
import { SettingsDialog } from "../settings/dialogs/settings-dialog";

const Main = dynamic(() => import("./main"), { ssr: false });

export default function HomePage() {
  return (
    <div className="font-sans flex h-screen w-screen justify-center overscroll-none">
      <header className="fixed top-0 left-0 z-40 flex h-12 w-full items-center justify-between px-2 sm:px-4 bg-background/80 backdrop-blur-md border-b border-border">
        <Logo />
        <div className="flex items-center">
          <Tooltip title="Star DeerFlow on GitHub">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/drfccv/deer-flow-cn"
                target="_blank"
              >
                <GithubOutlined />
              </Link>
            </Button>
          </Tooltip>
          <ThemeToggle />
          <Suspense>
            <SettingsDialog />
          </Suspense>
        </div>
      </header>
      <div className="flex flex-col w-full h-full pt-12">
        <Suspense fallback={<div>Loading DeerFlow...</div>}>
          <Main />
        </Suspense>
      </div>
    </div>
  );
}
