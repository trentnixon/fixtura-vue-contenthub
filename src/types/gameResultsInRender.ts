export interface GameResultsInRenderAttributes {
  render: number;
  game_meta_datum?: number | null;
  game_data_afl?: number | null;
  game_data_netball?: number | null;
  game_data_hockey?: number | null;
  game_data_basketball?: number | null;
}

export interface GameResultsInRender {
  id: number;
  attributes: GameResultsInRenderAttributes;
}

export interface GameResultsInRenderState {
  gameResultsInRender: GameResultsInRender | null;
  gameResultsInRenderByRenderID: GameResultsInRender[];
  loading: boolean;
  error: string | null;
}
