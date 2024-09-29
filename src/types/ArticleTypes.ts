// src/types/ArticleTypes.ts

export interface ArticleComponent {
  copyArticle: () => Promise<void>;
}

export interface TopScorer {
  position: number;
  player_name: string;
  matches: number;
  performance_stats: string;
  article_body: string;
  highlights?: string;
}

export interface StructuredOutput {
  title: string;
  subtitle: string;
  top_scorers: TopScorer[];
  social_media_post?: string;
  twitter_post?: string;
}

export interface Top5ListicleArticle {
  type: "top5bowlinglist" | "top5battinglist";
  structuredOutput: StructuredOutput;
}

export interface League {
  title: string;
  subtitle: string;
  article_body: string;
}

export interface LadderSummaryStructuredOutput {
  leagues: League[];
}

export interface LadderSummaryArticle {
  type: "ladder";
  structuredOutput: LadderSummaryStructuredOutput;
}

export interface Fixture {
  match: string;
  date: string;
  time: string;
  ground: string;
  summary: string;
}

export interface UpcomingFixturesStructuredOutput {
  fixtures: Fixture[];
}

export interface UpcomingFixturesArticle {
  type: "upcomingfixtures";
  structuredOutput: UpcomingFixturesStructuredOutput;
}

export interface WeekendResult {
  title: string;
  subtitle: string;
  article_body: string;
  highlights: string;
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  winner: string;
}

export interface WeekendWrapUpStructuredOutput {
  results: WeekendResult[];
}

export interface WeekendWrapUpArticle {
  type: "weekendresults";
  structuredOutput: WeekendWrapUpStructuredOutput;
}

// src/types/WeekendSingleGameTypes.ts

export interface ImageAsset {
  url: string;
}

export interface WeekendSingleGameResult {
  id: number;
  CompositionID: string;
  grouping_category: string;
  structuredOutput: {
    match_identifier: string;
    team1: string;
    team2: string;
    score1: string;
    score2: string;
    winner: string;
    title: string;
    subtitle: string;
    article_body: string;
    highlights: string;
    social_media_post?: string;
    twitter_post?: string;
  };
}

export interface WeekendSingleGameProps {
  imageAssets: ImageAsset[];
  formattedArticles: WeekendSingleGameResult[];
}

export type Article =
  | Top5ListicleArticle
  | LadderSummaryArticle
  | UpcomingFixturesArticle
  | WeekendWrapUpArticle;
