import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentRepo {
    owner: string;
    repo: string;
    fullName: string;
    description: string | null;
    primaryLanguage: string | null;
    fileCount: number;
    analyzedAt: string;
}

interface RecentReposStore {
    repos: RecentRepo[];
    addRecentRepo: (repo: Omit<RecentRepo, "analyzedAt">) => void;
}

const MAX_RECENT = 6;

export const useRecentReposStore = create<RecentReposStore>()(
    persist(
        (set) => ({
            repos: [],
            addRecentRepo: (repo) =>
                set((state) => {
                    const filtered = state.repos.filter((r) => r.fullName !== repo.fullName);
                    const updated = [{ ...repo, analyzedAt: new Date().toISOString() }, ...filtered];
                    return { repos: updated.slice(0, MAX_RECENT) };
                }),
        }),
        { name: "devforge-recent-repos" },
    ),
);