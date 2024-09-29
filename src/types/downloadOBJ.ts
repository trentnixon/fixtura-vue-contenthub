export interface DownloadOBJ {
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
  };
  VIDEOMETA: {
    Video: {
      TIMINGS: {
        FPS_INTRO: number;
        FPS_SCORECARD: number;
        FPS_OUTRO: number;
        FPS_MAIN: number;
      };
      Template: string;
      TemplateVariation: {
        borderRadius: string;
        Background: string;
      };
      Theme: {
        primary: string;
        secondary: string;
        dark: string;
        white: string;
      };
      includeSponsors: boolean;
      ASSETID: number;
      ASSETTYPEID: number;
      Title: string;
      TitleSplit: string[];
      CompositionID: string;
      FRAMES: number[];
      HeroImage: string | null;
      audio_option: string;
      VideoTitle: string;
    };
    Club: {
      Sponsors: string[];
      Name: string;
      Logo: string;
    };
    grouping_category: string;
  };
  THEME: {
    Template: string;
    TemplateVariation: {
      borderRadius: string;
      Background: string;
    };
    Theme: {
      primary: string;
      secondary: string;
      dark: string;
      white: string;
    };
  };
  TIMINGS: {
    FPS_INTRO: number;
    FPS_SCORECARD: number;
    FPS_OUTRO: number;
    FPS_MAIN: number;
  };
  PROMPT: any[]; // Specify the type if known
  DATA: any[];
}
