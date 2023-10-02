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
@WebSocketGateway(8080, { cors: { origin: '*' } })
export class EmulatorGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly emulatorService: EmulatorService) {}

  @SubscribeMessage('create')
  async onCreate(client: any, eventData: any): Promise<void> {
    const emulatorCreate = this.emulatorService.create({
      game: eventData.game,
      currency: eventData.currency,
      balance: eventData.balance,
      emulatorsCount: eventData.emulatorsCount,
    });

    for await (const emulator of emulatorCreate) {
      client.emit('create', emulator);
    }
  }

  // @SubscribeMessage('initialize')
  // async onInitialize(client: any, eventData: any): Promise<void> {
  //   const { id, data } = await this.emulatorService.initialize({
  //     game: eventData.game,
  //     playerId: eventData.playerId,
  //     currency: eventData.currency,
  //     balance: eventData.balance,
  //   });

  //   client.emit('initialize', { id, data });
  // }

  @SubscribeMessage('game-emulation')
  async onGameEmulation(client: any, eventData: any): Promise<void> {
    client.emit('game-emulation', {
      id: eventData.id,
      status: 'starting',
      betIteration: eventData.betIteration,
    });

    const emulations = this.emulatorService.gameEmulation({
      id: eventData.id,
      betIterations: eventData.betIterations,
    });

    for await (const emulation of emulations) {
      client.emit('game-emulation', {
        ...emulation,
        status: 'progress',
      });
    }

    client.emit('game-emulation', {
      id: eventData.id,
      status: 'ended',
    });
  }
}
