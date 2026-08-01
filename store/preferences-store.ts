import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DefaultRepoView = "overview" | "architecture" | "dependencies" | "metrics";

interface PreferencesStore {
  defaultRepoView: DefaultRepoView;
  autoGenerateReport: boolean;
  setDefaultRepoView: (view: DefaultRepoView) => void;
  setAutoGenerateReport: (value: boolean) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      defaultRepoView: "overview",
      autoGenerateReport: false,
      setDefaultRepoView: (view) => set({ defaultRepoView: view }),
      setAutoGenerateReport: (value) => set({ autoGenerateReport: value }),
    }),
    { name: "devforge-preferences" },
  ),
);