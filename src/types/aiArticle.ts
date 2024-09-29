export interface AiArticleAttributes {
  Name: string;
  grouping_category: string;
  ArticleJournalist: string;
  ArticleEditor: string;
  hasBias: string;
  openAiID: string;
  openAiCreated: number;
  openAiPrompt_tokens: number;
  openAiCompletionTokens: number;
  openAiTotalTokens: number;
  hasCompleted: boolean;
  forceRerender: boolean;
  hasError: boolean;
  assetLinkID: string;
  publishedAt: string;
  createdAt: string;
  structuredOutput: string;
  asset_type: {
    data: {
      attributes: {
        Name: string;
      };
    };
  };
  asset_category: {
    data: {
      attributes: {
        Name: string;
        Identifier: string;
      };
    };
  };
  asset: {
    data: {
      attributes: {
        Name: string;
        CompositionID: string;
      };
    };
  };
}

export interface AiArticle {
  id: number;
  attributes: AiArticleAttributes;
}

export interface AiArticleState {
  aiArticle: AiArticle | null;
  aiArticles: AiArticle[];
  loading: boolean;
  error: string | null;
}

export interface FormattedAiArticle {
  id: number;
  attributes: {
    Name: string; // Required by AiArticleAttributes
    grouping_category: string; // Required by AiArticleAttributes
    ArticleJournalist: string; // Required by AiArticleAttributes
    ArticleEditor: string; // Required by AiArticleAttributes
    hasBias: string; // Required by AiArticleAttributes
    openAiID: string; // Required by AiArticleAttributes
    openAiCreated: number; // Required by AiArticleAttributes
    openAiPrompt_tokens: number; // Required by AiArticleAttributes
    openAiCompletionTokens: number; // Required by AiArticleAttributes
    openAiTotalTokens: number; // Required by AiArticleAttributes
    hasCompleted: boolean; // Required by AiArticleAttributes
    forceRerender: boolean; // Required by AiArticleAttributes
    hasError: boolean; // Required by AiArticleAttributes
    assetLinkID: string; // Required by AiArticleAttributes
    publishedAt: string; // Required by AiArticleAttributes
    createdAt: string; // Required by AiArticleAttributes
    structuredOutput: string; // Required by AiArticleAttributes
    asset_type: {
      data: {
        attributes: {
          Name: string;
        };
      };
    };
    asset_category: {
      data: {
        attributes: {
          Name: string;
          Identifier: string;
        };
      };
    };
    asset: {
      data: {
        attributes: {
          Name: string;
          CompositionID: string;
        };
      };
    };
  };
}
