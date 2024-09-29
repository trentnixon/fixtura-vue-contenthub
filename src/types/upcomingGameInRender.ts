export interface UpcomingGameInRenderAttributes {
    render: any;
    game_meta_datum: any;
    game_data_afl: any;
    game_data_netball: any;
    game_data_hockey: any;
    game_data_basketball: any;
  }

  export interface UpcomingGameInRender {
    id: number;
    attributes: UpcomingGameInRenderAttributes;
  }

  export interface UpcomingGameInRenderState {
    upcomingGameInRender: UpcomingGameInRender | null;
    loading: boolean;
    error: string | null;
  }
