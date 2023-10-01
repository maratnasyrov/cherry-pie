export type CreateInput = {
  game: string;
  playerId: string;
  balance: number;
  currency: string;
};

export type CreateReturn = {
  token: string;
};
