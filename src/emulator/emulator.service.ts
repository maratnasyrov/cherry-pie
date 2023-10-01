import { Injectable } from '@nestjs/common';
import { ServerService } from '../server/server.service';
import { SessionService } from 'src/session/session.service';
import { GameEmulationInput, InitializeInput } from './emulator.interface';
import { EmulatorError, EmulatorException } from './emulator.exception';
import { GambleReturn } from 'src/server/server.interface';

@Injectable()
export class EmulatorService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly serverService: ServerService
  ) {}

  async initialize(input: InitializeInput) {
    const { token } = await this.sessionService.create({
      game: input.game,
      playerId: input.playerId,
      currency: input.currency,
      balance: input.balance,
    });

    const {
      clientId,
      currency: { range },
    } = await this.serverService.init({
      token,
      game: input.game,
    });

    const id = `${input.playerId}_${input.game}_${input.currency}`;

    return {
      id,
      data: {
        auth: { token, clientId },
        currency: { range },
      },
    };
  }

  async *gameEmulation(input: GameEmulationInput): AsyncGenerator<number> {
    if (input.betCount === 0 || input.betCount > 10) {
      throw new EmulatorException(
        EmulatorError.BetCountNumberIncorrect,
        'Bet count incorrect',
        { ...input }
      );
    }
    let left = input.betCount;
    const { gamble, bet } = input.settings;

    while (left > 0) {
      let betId = 0;

      if (bet.type === 'select') {
        betId = bet.value;
      } else {
        const betIndex = Math.floor(Math.random() * bet.range.length);
        betId = bet.range[betIndex];
      }

      const { result } = await this.serverService.bet({
        bet: betId,
        token: input.token,
        clientId: input.clientId,
        game: input.game,
      });

      let gambleAvailable = result.step.gamble?.available ?? [];
      let gambleCount = 0;
      let gambleResult: GambleReturn = undefined;

      while (gambleAvailable.length > 0) {
        if (gamble && gambleCount < gamble.count) {
          let [gambleId] = gambleAvailable;

          if (gamble.type === 'select') {
            gambleId = gamble.gambleId;
          }
          if (gamble.type === 'random') {
            const gambleIndex = Math.floor(
              Math.random() * gambleAvailable.length
            );
            gambleId = gambleAvailable[gambleIndex];
          }

          gambleResult = await this.serverService.gamble({
            token: input.token,
            clientId: input.clientId,
            game: input.game,
            gambleId: gambleId,
          });

          gambleCount = gambleCount + 1;
          gambleAvailable = gambleResult.result.step.gamble?.available ?? [];
        }

        if (
          gamble &&
          gambleCount === gamble.count &&
          gambleResult?.result.step.gamble?.available?.length > 0
        ) {
          gambleAvailable = [];

          await this.serverService.collect({
            token: input.token,
            clientId: input.clientId,
            game: input.game,
          });
        }
      }

      left = left - 1;

      yield left;
    }
  }
}
