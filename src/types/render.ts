import { Scheduler } from "./scheduler";

// Define the structure for the metrics
interface MetricsSummary {
  totalDownloads: number;
  totalAiArticles: number;
  totalErrors: number;
  totalFixtures: number; // Added for fixture metrics
  totalGameResults: number;
  totalUpcomingGames: number;
  totalGrades: number;
}

interface GroupingCategoryMetrics {
  downloads: number;
  videos: number;
  images: number;
  aiWriteups: number;
  hasErrors: boolean;
  results: number; // Specific to fixtures
  upcoming: number; // Specific to fixtures
}

interface AssetCategorySplitMetrics {
  results: number | null;
  upcoming: number | null;
  statistics: number | null;
}

interface Metrics {
  summary: MetricsSummary;
  groupingCategories: Record<string, GroupingCategoryMetrics>; // Dynamic keys for grouping categories like "Junior" or "Senior"
  assetCategorySplit: {
    video: AssetCategorySplitMetrics;
    image: AssetCategorySplitMetrics;
    writeup: AssetCategorySplitMetrics;
  };
}

export interface RenderAttributes {
  Name: string;
  Processing: boolean;
  Complete: boolean;
  sendEmail: boolean | null; // Updated to allow null values
  hasTeamRosterRequest: boolean;
  hasTeamRosters: boolean;
  forceRerender: boolean;
  EmailSent: boolean;
  forceRerenderEmail: boolean;
  hasTeamRosterEmail: boolean;
  updatedAt: string;
  publishedAt: string;

  // Date and Time fields for render creation
  date: string; // E.g., "Tue 24th Sep"
  time: string; // E.g., "8:47 PM"

  // Total counts of downloads and AI articles
  downloads: number; // Number of downloads
  aiArticles: number; // Number of AI articles

  // Metrics (including summary, grouping categories, and asset category splits)
  metrics: Metrics;

  // New game-related fields
  gameResults: number; // Total game results
  upcomingGames: number; // Total upcoming games
  grades: number; // Total grades

  // Relations for game results, upcoming games, and grades
  game_results_in_renders: {
    data: Render[]; // Array of related game results
  };
  upcoming_games_in_renders: {
    data: Render[]; // Array of related upcoming games
  };
  grades_in_renders: {
    data: Render[]; // Array of related grades
  };

  // Scheduler related fields
  scheduler: {
    data: Scheduler;
  };
}

export interface Render {
  id: number;
  name: string;
  processing: boolean;
  complete: boolean;
  sendEmail: boolean | null;
  emailSent: boolean;
  forceRerender: boolean;
  forceRerenderEmail: boolean;
  hasTeamRosterRequest: boolean;
  isCreatingRoster: boolean;
  hasTeamRosters: boolean;
  hasTeamRosterEmail: boolean;
  date: string;
  time: string;
  downloads: number;
  aiArticles: number;
  metrics: Metrics;
  gameResults: number;
  upcomingGames: number;
  grades: number;
}

export interface RenderState {
  render: Render | null;
  renders: Render[];
  loading: boolean;
  error: string | null;
}
// Grouping Details specific interfaces
export interface GroupingDetails {
  id: number;
  name: string;
  groupingCategory: string;
  downloads: number;
  aiArticles: number;
  metrics: Metrics;
  assets: Record<string, { downloads: number; aiArticles: number }>; // Dynamic asset composition (e.g. CricketTop5Batting, CricketLadder, etc.)
}

// Interface for grouping response from API
export interface GroupingApiResponse {
  data: GroupingDetails;
}

export interface AssetItem {
  id: number;
  name: string;
  assetLinkID: string;
  compositionID: string;
  downloads: DownloadItem[];
  aiArticles: AIArticle[];
}

export interface DownloadItem {
  id: number;
  name: string;
  url: string;
  hasBeenProcessed: boolean;
  forceRerender: boolean;
}

export interface AIArticle {
  id: number;
  name: string;
  structuredOutput: any; // Keeping this flexible
  assetType: string;
}

export interface RenderAssetsResponse {
  [assetType: string]: {
    [assetLinkID: string]: {
      downloads: DownloadItem[];
      aiArticles: AIArticle[];
    };
  };
}

export interface RenderFixture {
  id: number;
  TeamRoster: string | null;
  ageGroup: string;
  urlToScoreCard: string;
  teamHome: string;
  teamAway: string;
}
