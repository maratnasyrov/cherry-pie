import { Injectable } from '@nestjs/common';
import { ServerService } from '../server/server.service';
import { SessionService } from 'src/session/session.service';
import {
  CreateInput,
  Emulator,
  GameEmulationInput,
  GameEmulationReturn,
  InitializeInput,
} from './emulator.interface';
import { EmulatorError, EmulatorException } from './emulator.exception';
import { GambleReturn } from 'src/server/server.interface';
import { randomName } from './emulator.helper';

const emulators: Array<Emulator> = [];

@Injectable()
export class EmulatorService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly serverService: ServerService
  ) {}

  async *create(input: CreateInput): AsyncGenerator<Emulator> {
    for (let index = 0; index < input.emulatorsCount; index += 1) {
      const emulator = await this.initialize({
        game: input.game,
        playerId: randomName(),
        balance: input.balance,
        currency: input.currency,
      });

      emulators.push(emulator);

      yield emulator;
    }
  }

  async *gameEmulation(
    input: GameEmulationInput
  ): AsyncGenerator<GameEmulationReturn> {
    const emulator = emulators.find((e) => e.id === input.id);

    if (!emulator) {
      throw new EmulatorException(
        EmulatorError.EmulatorNotFound,
        'Emulator not found',
        { ...input }
      );
    }
    if (input.betIterations === 0 || input.betIterations > 10) {
      throw new EmulatorException(
        EmulatorError.BetCountNumberIncorrect,
        'Bet count incorrect',
        { ...input }
      );
    }

    let left = input.betIterations;
    const { gamble, bet } = emulator.settings;

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
        token: emulator.token,
        clientId: emulator.clientId,
        game: emulator.game,
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
            token: emulator.token,
            clientId: emulator.clientId,
            game: emulator.game,
            gambleId: gambleId,
          });

          gambleCount = gambleCount + 1;
          gambleAvailable = gambleResult.result.step.gamble?.available ?? [];
        }

        if (
          !gamble ||
          (gamble &&
            gambleCount === gamble.count &&
            gambleResult?.result.step.gamble?.available?.length > 0)
        ) {
          gambleAvailable = [];

          await this.serverService.collect({
            token: emulator.token,
            clientId: emulator.clientId,
            game: emulator.game,
          });
        }
      }

      left = left - 1;

      yield { id: emulator.id, iteration: left };
    }
  }

  private async initialize(input: InitializeInput): Promise<Emulator> {
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
      token,
      clientId,
      game: input.game,
      settings: {
        bet: { type: 'random', range },
      },
    };
  }
}
