import { AiArticle, FormattedAiArticle } from "@/types";
import { usePrivateAiArticleState } from "./private";
import {
  fetchAiArticleFromService,
  fetchAiArticlesByRenderIdFromService,
} from "./service";

export async function fetchAiArticle(id: number) {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    const response = await fetchAiArticleFromService(id);
    if (response && response.data) {
      state.aiArticle = response.data;
      //console.log("Fetched AI Article details:", state.aiArticle);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchAiArticlesByRenderId(renderId: number) {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    const response = await fetchAiArticlesByRenderIdFromService(renderId);
    if (response && response.data) {
      state.aiArticlesByRenderID = response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchFullAiArticlesByIds(ids: number[]) {
  const state = usePrivateAiArticleState();

  try {
    state.loading = true;

    // Fetch all AI articles in parallel
    const responses = await Promise.all(
      ids.map((id) => fetchAiArticleFromService(id))
    );

    // Store each formatted article by its ID
    responses.forEach((response) => {
      if (response && response.data) {
        const rawArticle = response.data as AiArticle;
        const item = formatAiArticles(rawArticle);
        // Format the article and store it in the state
        state.fullAiArticles[response.data.id] = item;
      }
    });
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

function formatAiArticles(fullAiArticle: AiArticle): FormattedAiArticle {
  const id = fullAiArticle.id;

  // Extract all necessary fields, falling back to default values if not present
  const articleName = fullAiArticle.attributes?.Name || "Unknown Article";
  const groupingCategory =
    fullAiArticle.attributes?.grouping_category || "Unknown Category";
  const articleJournalist =
    fullAiArticle.attributes?.ArticleJournalist || "Unknown Journalist";
  const articleEditor =
    fullAiArticle.attributes?.ArticleEditor || "Unknown Editor";
  const hasBias = fullAiArticle.attributes?.hasBias || "None";
  const openAiID = fullAiArticle.attributes?.openAiID || "Unknown ID";
  const openAiCreated = fullAiArticle.attributes?.openAiCreated || 0;
  const openAiPrompt_tokens =
    fullAiArticle.attributes?.openAiPrompt_tokens || 0;
  const openAiCompletionTokens =
    fullAiArticle.attributes?.openAiCompletionTokens || 0;
  const structuredOutput =
    fullAiArticle.attributes?.structuredOutput || "Unknown";
  const openAiTotalTokens = fullAiArticle.attributes?.openAiTotalTokens || 0;
  const hasCompleted = fullAiArticle.attributes?.hasCompleted || false;
  const forceRerender = fullAiArticle.attributes?.forceRerender || false;
  const hasError = fullAiArticle.attributes?.hasError || false;
  const assetLinkID = fullAiArticle.attributes?.assetLinkID || "Unknown";
  const publishedAt = fullAiArticle.attributes?.publishedAt || "Unknown Date";
  const createdAt = fullAiArticle.attributes?.createdAt || "Unknown Date";

  return {
    id,
    attributes: {
      Name: articleName,
      grouping_category: groupingCategory,
      ArticleJournalist: articleJournalist,
      ArticleEditor: articleEditor,
      hasBias,
      openAiID,
      openAiCreated,
      openAiPrompt_tokens,
      openAiCompletionTokens,
      openAiTotalTokens,
      hasCompleted,
      forceRerender,
      hasError,
      assetLinkID,
      publishedAt,
      createdAt,
      structuredOutput,
      asset_type: fullAiArticle.attributes?.asset_type || {
        data: { attributes: { Name: "Unknown" } },
      },
      asset_category: fullAiArticle.attributes?.asset_category || {
        data: { attributes: { Name: "Unknown", Identifier: "Unknown" } },
      },
      asset: fullAiArticle.attributes?.asset || {
        data: { attributes: { Name: "Unknown", CompositionID: "Unknown" } },
      },
    },
  };
}
