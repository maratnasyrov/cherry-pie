export type BaseProps = {
  token: string;
  game: string;
};

export type InitProps = BaseProps;

export type BetProps = {
  clientId: string;
  bet: number;
} & BaseProps;

export type GambleProps = {
  clientId: string;
  gambleId: string;
} & BaseProps;

export type CollectProps = { clientId: string } & BaseProps;

export type InitReturn = {
  currency: { code: string; range: Array<number> };
  clientId: string;
};

export type BetReturn = {
  balance: number;
  result: {
    totalBet: number;
    betMultiplier: number;
    unfinished: boolean;
    nextStepType: number;
    step: {
      type: number;
      symbols: Array<{
        number: number;
        position: {
          x: number;
          y: number;
        };
      }>;
      wins: Array<{
        type: number;
        amount: number;
        symbol: number;
        symbols: Array<{
          number: number;
          position: {
            x: number;
            y: number;
          };
        }>;
        line: number;
      }>;
      stepWin: number;
      roundCost: number;
      totalWin: number;
      gamble?:
        | {
            available?: Array<string>;
            current?: {
              id: number;
              played: number;
              multiplier: number;
            };
          }
        | undefined;
      unfinishedStep: boolean;
      maxWinReached: boolean;
    };
  };
};

export type GambleReturn = BetReturn;
