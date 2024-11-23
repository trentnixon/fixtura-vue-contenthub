// types.ts

export interface Download {
  id: number;
  hasBeenProcessed: boolean;
  hasError: boolean;
  forceRerender: boolean;
  assetLinkID: string;
}

export interface AiArticle {
  id: number;
  ArticleDataForPrompt: { game: string }[];
}

export interface VideoMeta {
  grouping_category: string;
  Video: {
    Title: string;
    TitleSplit: [string, string];
    CompositionID: string;
    VideoTitle: string;
    HeroImage: {
      url: string;
      width: number;
      height: number;
      ratio: string;
      AgeGroup: string;
      AssetType: string;
      markerPosition: string;
    };
    Template: string;
    TemplateVariation: {
      useForcedColor: string;
      useMutedColor: string;
    };
    Theme: {
      primary: string;
      secondary: string;
      dark: string;
      white: string;
    };
    includeSponsors: boolean;
    audio_option: string;
    DiviedFixturesBy: {
      UpComingFixtures: number;
      WeekendResults: number;
      WeekendSingleGameResult: number;
      Ladder: number;
      RosterPoster: number;
    };
    ASSETID: number;
    ASSETTYPEID: number;
    FRAMES: number[];
  };
}

export interface Theme {
  Template: string;
  TemplateVariation: {
    useForcedColor: string;
    useMutedColor: string;
  };
  Theme: {
    primary: string;
    secondary: string;
    dark: string;
    white: string;
  };
}

export interface Club {
  Name: string;
  Sport: string;
  Logo: {
    url: string;
    width: number;
    height: number;
  };
  Sponsors: {
    default: {
      primary_sponsor: Sponsor;
      general_sponsors: Sponsor[];
    };
    team: TeamSponsor[];
  };
}

export interface Sponsor {
  sponsorId: number;
  name: string;
  logo: {
    url: string;
    width: number;
    height: number;
  };
}

export interface TeamSponsor {
  level: string;
  id: number;
  allocationName: string;
  sponsorId: number;
  name: string;
  logo: {
    url: string;
    width: number;
    height: number;
  };
}

export interface DataObj {
  RENDER: {
    SchedulerID: number;
    RenderID: number;
  };
  ACCOUNT: {
    accountId: number;
  };
  ASSET: {
    ASSETID: number;
    ASSETTYPEID: number;
    ASSETCATEGORYID: number;
    ASSETSLINKID: string;
  };
  VIDEOMETA: VideoMeta;
  THEME: Theme;
  Club: Club;
}

export interface AssetData {
  data: {
    downloads: Download[];
    aiArticles: AiArticle[];
    dataObj: DataObj;
  };
}

// Define the state structure for Pinia
export interface fetchAssetByLink {
  data: AssetData | null;
}
