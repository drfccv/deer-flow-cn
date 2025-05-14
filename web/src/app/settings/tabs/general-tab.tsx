// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import type { SettingsState } from "~/core/store";

import type { Tab } from "./types";

const generalFormSchema = z.object({
  autoAcceptedPlan: z.boolean(),
  enableBackgroundInvestigation: z.boolean(),
  maxPlanIterations: z.number().min(1, {
    message: "Max plan iterations must be at least 1.",
  }),
  maxStepNum: z.number().min(1, {
    message: "Max step number must be at least 1.",
  }),
});

export const GeneralTab: Tab = ({
  settings,
  onChange,
}: {
  settings: SettingsState;
  onChange: (changes: Partial<SettingsState>) => void;
}) => {
  const generalSettings = useMemo(() => settings.general, [settings]);
  const form = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema, undefined, undefined),
    defaultValues: generalSettings,
    mode: "all",
    reValidateMode: "onBlur",
  });

  const currentSettings = form.watch();
  useEffect(() => {
    let hasChanges = false;
    for (const key in currentSettings) {
      if (
        currentSettings[key as keyof typeof currentSettings] !==
        settings.general[key as keyof SettingsState["general"]]
      ) {
        hasChanges = true;
        break;
      }
    }
    if (hasChanges) {
      onChange({ general: currentSettings });
    }
  }, [currentSettings, onChange, settings]);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-lg font-medium">通用设置</h1>
      </header>
      <main>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="autoAcceptedPlan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="autoAcceptedPlan"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label className="text-sm" htmlFor="autoAcceptedPlan">
                        允许自动接受研究计划
                      </Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxPlanIterations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>最大计划迭代次数</FormLabel>
                  <FormControl>
                    <Input
                      className="w-60"
                      type="number"
                      defaultValue={field.value}
                      onChange={(event) =>
                        field.onChange(parseInt(event.target.value || "0"))
                      }
                      min={1}
                    />
                  </FormControl>
                  <FormDescription>
                    设为1表示单步规划，2或以上启用重新规划。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxStepNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>研究计划最大步骤数</FormLabel>
                  <FormControl>
                    <Input
                      className="w-60"
                      type="number"
                      defaultValue={field.value}
                      onChange={(event) =>
                        field.onChange(parseInt(event.target.value || "0"))
                      }
                      min={1}
                    />
                  </FormControl>
                  <FormDescription>
                    默认每个研究计划有3个步骤。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </main>
    </div>
  );
};
GeneralTab.displayName = "通用设置";
GeneralTab.icon = Settings;
