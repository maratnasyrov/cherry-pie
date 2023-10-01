export type InitializeInput = {
  game: string;
  playerId: string;
  balance: number;
  serverUrl: string;
  currency: string;
};

export type GameEmulationInput = {
  game: string;
  bet: number;
  token: string;
  clientId: string;
  serverUrl: string;
  betCount: number;
};
