import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { ServerService } from './server.service';
import {
  BetProps,
  CollectProps,
  GambleProps,
  InitProps,
  InitReturn,
} from './server.interface';
import { ServerExceptionFilter } from './server-exception.filter';

@UseFilters(ServerExceptionFilter)
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post('init')
  async init(@Body() input: InitProps): Promise<InitReturn> {
    const data = await this.serverService.init({
      serverUrl: input.serverUrl,
      token: input.token,
      game: input.game,
    });

    return data;
  }

  @Post('bet')
  async bet(@Body() input: BetProps): Promise<any> {
    const bet = await this.serverService.bet({
      clientId: input.clientId,
      serverUrl: input.serverUrl,
      token: input.token,
      game: input.game,
      bet: input.bet,
    });

    return bet;
  }

  @Post('gamble')
  async gamble(@Body() input: GambleProps): Promise<any> {
    const gamble = await this.serverService.gamble({
      clientId: input.clientId,
      serverUrl: input.serverUrl,
      token: input.token,
      gambleId: input.gambleId,
      game: input.game,
    });

    return gamble;
  }

  @Post('collect')
  async collect(@Body() input: CollectProps): Promise<any> {
    const collect = await this.serverService.collect({
      clientId: input.clientId,
      serverUrl: input.serverUrl,
      token: input.token,
      game: input.game,
    });

    return collect;
  }
}
