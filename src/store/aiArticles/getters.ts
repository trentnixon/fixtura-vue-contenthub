import { computed } from "vue";
import { usePrivateAiArticleState } from "./private";

export const aiArticle = computed(() => usePrivateAiArticleState().aiArticle);
export const aiArticlesByRenderID = computed(
  () => usePrivateAiArticleState().aiArticlesByRenderID
);
export const loading = computed(() => usePrivateAiArticleState().loading);
export const error = computed(() => usePrivateAiArticleState().error);

export const getAiArticleById = (id: number) => {
  return (
    aiArticlesByRenderID.value.find((aiArticle) => aiArticle.id === id) || null
  );
};
export const fullAiArticleById = (id: number) => {
  return computed(() => usePrivateAiArticleState().fullAiArticles[id] || null);
};

export const getFullAiArticles = () => {
  return usePrivateAiArticleState().fullAiArticles || [];
};
