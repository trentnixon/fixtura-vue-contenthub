import { defineStore } from "pinia";
import { AiArticle } from "@/types";

interface PrivateAiArticleState {
  aiArticle: AiArticle | null;
  aiArticlesByRenderID: AiArticle[];
  loading: boolean;
  error: string | null;
  fullAiArticles: Record<number, AiArticle>;
  // New fields for async trigger/polling flow
  status?: "idle" | "waiting" | "pending" | "writing" | "completed" | "failed";
  jobId?: string | null;
  articleId?: number | null;
}

export const usePrivateAiArticleState = defineStore("aiArticles-private", {
  state: (): PrivateAiArticleState => ({
    aiArticle: null,
    aiArticlesByRenderID: [],
    loading: false,
    error: null,
    fullAiArticles: {},
    status: "idle",
    jobId: null,
    articleId: null,
  }),
});
