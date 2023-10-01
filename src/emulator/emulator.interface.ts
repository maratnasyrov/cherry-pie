export type InitializeInput = {
  game: string;
  playerId: string;
  balance: number;
  serverUrl: string;
  currency: string;
};

export type GameEmulationInput = {
  id: string;
  game: string;
  bet: number;
  token: string;
  clientId: string;
  serverUrl: string;
  betCount: number;
};
