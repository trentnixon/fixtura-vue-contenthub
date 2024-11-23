export interface Account {
  id: number;
  FirstName: string;
  LastName: string | null;
  DeliveryAddress: string;
  isActive: boolean;
  isSetup: boolean;
  Sport: string;
  accountOrganisationDetails: {
    id: number;
    Name: string;
    href: string;
    ParentLogo: string;
    Sport: string;
  };
  scheduler: {
    id: number;
    isRendering: boolean;
    Queued: boolean;
  };
  account_type: number;
  render_token: {
    id: number;
    token: string;
    expiration: string;
  };
  template: string;
  theme: {
    primary: string;
    secondary: string;
    dark: string;
    white: string;
  };
  renders: Array<{
    id: number;
    Name: string;
    Processing: boolean;
    Complete: boolean;
    sendEmail: boolean;
    EmailSent: boolean;
    hasTeamRosterRequest: boolean;
    hasTeamRosters: boolean;
    hasTeamRosterEmail: boolean;
    forceRerender: boolean;
    forceRerenderEmail: boolean;
    game_results_in_renders_count: number;
    upcoming_games_in_renders_count: number;
    grades_in_renders_count: number;
    downloads_count: number;
    ai_articles_count: number;
  }>;
  rollup: RollupMetrics;
  metricsOverTime: MetricsOverTime;
  metricsAsPercentageOfCost: MetricsAsPercentageOfCost;
}

export interface RollupMetrics {
  totalRenders: number;
  totalProcessingRenders: number;
  totalCompleteRenders: number;
  totalEmailsSent: number;
  totalTeamRosterRequests: number;
  totalTeamRosters: number;
  totalTeamRosterEmails: number;
  totalForceRerenders: number;
  totalForceRerenderEmails: number;
  totalGameResults: number;
  totalUpcomingGames: number;
  totalGrades: number;
  totalDownloads: number;
  totalAiArticles: number;
}

/*
MetricsOverTime : {"totalRenders":5,"totalCompleteRenders":5,"totalDownloads":52,"totalEmailsSent":5,"totalGameResults":8,"totalUpcomingGames":5,"totalGrades":5,"totalAiArticles":34,"GameResultsArr":[2,2,1,1,2],"UpcomingGamesArr":[2,2,0,0,1],"GradesArr":[1,1,1,1,1],"AiArticlesArr":[8,8,5,5,8],"DownloadsArr":[11,11,9,9,12]}
*/
export interface MetricsOverTime {
  totalRenders: number;
  totalCompleteRenders: number;
  totalDownloads: number;
  totalEmailsSent: number;
  totalGameResults: number;
  totalUpcomingGames: number;
  totalGrades: number;
  totalAiArticles: number;
  GameResultsArr: number[];
}

/*
MetricsAsPercentageOfCost : {"valuePerRender":20,"totalCostByAccount":100,"totalDigitalAssets":86,"percentageCompleteRenders":100,"percentageProcessingRenders":0,"percentageGameResults":9.30232558139535,"percentageDownloads":60.46511627906976,"percentageAiArticles":39.53488372093023,"averageCostPerDigitalAsset":1.1627906976744187,"averageCostOverTime":[0.95,0.95,0.7,0.7,1]}
*/
export interface MetricsAsPercentageOfCost {
  valuePerRender: number;
  totalCostByAccount: number;
  totalDigitalAssets: number;
  percentageCompleteRenders: number;
  percentageProcessingRenders: number;
  percentageGameResults: number;
  percentageDownloads: number;
  percentageAiArticles: number;
  averageCostPerDigitalAsset: number;
  averageCostOverTime: number[];
}

export interface AccountResponse {
  data: Account;
}

// Root response structure from the API
// Full API response type
export interface RelatedClubsResponse {
  id: number;
  attributes: {
    Name: string;
    clubs: {
      data: Array<{
        id: number;
        attributes: {
          Name: string;
          Logo: {
            data: {
              attributes: {
                url: string;
                width: number;
                height: number;
              };
            } | null;
          };
          ParentLogo: string | null;
        };
      }>;
    };
  };
}

// Simplified club structure
export interface RelatedClub {
  id: number;
  name: string;
  logo: {
    url: string;
    width: number;
    height: number;
  };
}
