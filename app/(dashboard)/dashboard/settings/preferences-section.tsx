"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePreferencesStore, type DefaultRepoView } from "@/store/preferences-store";

const viewOptions: { value: DefaultRepoView; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "architecture", label: "Architecture" },
  { value: "dependencies", label: "Dependencies" },
  { value: "metrics", label: "Metrics" },
];

export function PreferencesSection() {
  const { defaultRepoView, autoGenerateReport, setDefaultRepoView, setAutoGenerateReport } =
    usePreferencesStore();

  return (
    <section className="bg-card border border-border rounded-xl p-lg space-y-lg">
      <div className="flex items-center gap-md">
        <SlidersHorizontal className="size-5 text-primary" />
        <h3 className="text-headline-sm text-foreground">Preferences</h3>
      </div>

      <div className="space-y-2">
        <label className="text-body-md text-foreground font-medium">
          Default repository view
        </label>
        <p className="text-body-sm text-muted-foreground mb-2">
          Which page opens first when you view an analyzed repository.
        </p>
        <select
          value={defaultRepoView}
          onChange={(e) => setDefaultRepoView(e.target.value as DefaultRepoView)}
          className="bg-muted border border-border rounded-lg px-3 py-2 text-body-sm text-foreground"
        >
          {viewOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-body-md text-foreground font-medium">Auto-generate AI report</p>
          <p className="text-body-sm text-muted-foreground">
            Automatically generate an AI report when opening the Report page. Uses a Groq API
            call each time.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoGenerateReport}
            onChange={(e) => setAutoGenerateReport(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>

      <p className="text-label-caps text-muted-foreground">
        Preferences are saved in this browser only.
      </p>
    </section>
  );
}