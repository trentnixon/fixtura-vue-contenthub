import { defineStore } from "pinia";
import { AiArticle } from "@/types";

interface PrivateAiArticleState {
  aiArticle: AiArticle | null;
  aiArticlesByRenderID: AiArticle[];
  loading: boolean;
  error: string | null;
  fullAiArticles: Record<number, AiArticle>;
}

export const usePrivateAiArticleState = defineStore("aiArticles-private", {
  state: (): PrivateAiArticleState => ({
    aiArticle: null,
    aiArticlesByRenderID: [],
    loading: false,
    error: null,
    fullAiArticles: {},
  }),
});
