import { Injectable } from '@nestjs/common';
import { ServerService } from '../server/server.service';
import { SessionService } from 'src/session/session.service';
import { GameEmulationInput, InitializeInput } from './emulator.interface';
import { EmulatorError, EmulatorException } from './emulator.exception';

@Injectable()
export class EmulatorService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly serverService: ServerService,
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
      serverUrl: input.serverUrl,
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
        { input },
      );
    }
    let left = input.betCount;

    while (left > 0) {
      const { result } = await this.serverService.bet({
        bet: input.bet,
        token: input.token,
        clientId: input.clientId,
        game: input.game,
        serverUrl: input.serverUrl,
      });

      if (result.step.gamble?.available.length > 0) {
        await this.serverService.collect({
          token: input.token,
          clientId: input.clientId,
          game: input.game,
          serverUrl: input.serverUrl,
        });
      }

      left = left - 1;

      yield left;
    }
  }
}
