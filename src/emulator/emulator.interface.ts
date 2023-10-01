export type InitializeInput = {
  game: string;
  playerId: string;
  balance: number;
  currency: string;
};

export type GameEmulationInput = {
  id: string;
  game: string;
  bet: number;
  token: string;
  clientId: string;
  betCount: number;
};
