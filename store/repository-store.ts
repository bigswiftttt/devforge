import { create } from "zustand";
import type { NormalizedRepository } from "@/types/repository";

interface RepositoryStore {
    currentRepository: NormalizedRepository | null;
    setCurrentRepository: (repo: NormalizedRepository | null) => void;
}

export const useRepositoryStore = create<RepositoryStore>((set) => ({
    currentRepository: null,
    setCurrentRepository: (repo) => set({ currentRepository: repo }),
}));