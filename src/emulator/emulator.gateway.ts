import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EmulatorService } from './emulator.service';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { EmulatorExceptionsFilter } from './emulator-exception.filter';
import { EmulatorLoggingInterceptor } from './emulator-logging.interceptor';

@UseFilters(EmulatorExceptionsFilter)
@UseInterceptors(EmulatorLoggingInterceptor)
@WebSocketGateway(8080)
export class EmulatorGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly emulatorService: EmulatorService) {}

  @SubscribeMessage('initialize')
  async onInitialize(client: any, eventData: any): Promise<void> {
    const { id, data } = await this.emulatorService.initialize({
      game: eventData.game,
      playerId: eventData.playerId,
      currency: eventData.currency,
      balance: eventData.balance,
    });

    client.emit('initialize', { id, data });
  }

  @SubscribeMessage('game-emulation')
  async onGameEmulation(client: any, eventData: any): Promise<void> {
    client.emit('game-emulation', {
      id: eventData.id,
      status: 'starting',
      data: { betCount: eventData.betCount },
    });

    const emulations = this.emulatorService.gameEmulation({
      id: eventData.id,
      game: eventData.game,
      token: eventData.token,
      betCount: eventData.betCount,
      clientId: eventData.clientId,
      settings: eventData.settings,
    });

    for await (const betCount of emulations) {
      client.emit('game-emulation', {
        id: eventData.id,
        status: 'progress',
        data: { betCount },
      });
    }

    client.emit('game-emulation', {
      id: eventData.id,
      status: 'ended',
    });
  }
}
