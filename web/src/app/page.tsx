// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { GithubOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "~/components/ui/button";

import { Jumbotron } from "./landing/components/jumbotron";
import { Ray } from "./landing/components/ray";
import { CaseStudySection } from "./landing/sections/case-study-section";
import { CoreFeatureSection } from "./landing/sections/core-features-section";
import { JoinCommunitySection } from "./landing/sections/join-community-section";
import { MultiAgentSection } from "./landing/sections/multi-agent-section";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header />
      <main className="container flex flex-col items-center justify-center gap-20 sm:gap-32 px-2 sm:px-0 w-full max-w-full">
        <Jumbotron />
        <CaseStudySection />
        <MultiAgentSection />
        <CoreFeatureSection />
        <JoinCommunitySection />
      </main>
      <Footer />
      <Ray />
    </div>
  );
}

function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/80 bg-background/40 sticky top-0 left-0 z-40 flex h-14 w-full flex-col items-center backdrop-blur-lg px-2 sm:px-0">
      <div className="container flex h-14 items-center justify-between px-0 sm:px-3 w-full max-w-full">
        <div className="text-xl font-medium">
          <span className="mr-1 text-2xl">🦌</span>
          <span className="hidden sm:inline">DeerFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="https://github.com/drfccv/deer-flow-cn" target="_blank">
              <GithubOutlined />
              <span className="hidden sm:inline">Star on GitHub</span>
            </Link>
          </Button>
        </div>
      </div>
      <hr className="from-border/0 via-border/70 to-border/0 m-0 h-px w-full border-none bg-gradient-to-r" />
    </header>
  );
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="container mt-16 sm:mt-32 flex flex-col items-center justify-center px-2 sm:px-0 w-full max-w-full">
      <hr className="from-border/0 via-border/70 to-border/0 m-0 h-px w-full border-none bg-gradient-to-r" />
      <div className="text-muted-foreground container flex h-20 flex-col items-center justify-center text-xs sm:text-sm">
        <p className="text-center font-serif text-base sm:text-lg md:text-xl">
          &quot;Originated from Open Source, give back to Open Source.&quot;
        </p>
      </div>
      <div className="text-muted-foreground container mb-8 flex flex-col items-center justify-center text-[10px] sm:text-xs">
        <p>Licensed under MIT License</p>
        <p>&copy; {year} DeerFlow</p>
      </div>
    </footer>
  );
}
