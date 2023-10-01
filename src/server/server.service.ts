import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  BetProps,
  BetReturn,
  CollectProps,
  GambleProps,
  InitProps,
  InitReturn,
} from './server.interface';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { ServerError, ServerException } from './server.exception';

@Injectable()
export class ServerService {
  constructor(private readonly httpService: HttpService) {}

  async init(input: InitProps): Promise<InitReturn> {
    const data = await this.send<InitReturn>(
      `${input.serverUrl}/gameplay/init`,
      { game: input.game },
      { headers: { Authorization: `Bearer ${input.token}` } },
    );

    return data;
  }

  async bet(input: BetProps): Promise<BetReturn> {
    const data = await this.send<BetReturn>(
      `${input.serverUrl}/gameplay/command`,
      { clientId: input.clientId, command: 'bet', payload: { bet: input.bet } },
      { headers: { Authorization: `Bearer ${input.token}` } },
    );

    return data;
  }

  async gamble(input: GambleProps): Promise<any> {
    const data = await this.send(
      `${input.serverUrl}/gameplay/command`,
      {
        clientId: input.clientId,
        command: 'gamble',
        payload: { gambleId: input.gambleId },
      },
      { headers: { Authorization: `Bearer ${input.token}` } },
    );

    return data;
  }

  async collect(input: CollectProps): Promise<any> {
    const data = await this.send(
      `${input.serverUrl}/gameplay/command`,
      {
        clientId: input.clientId,
        command: 'collect',
      },
      { headers: { Authorization: `Bearer ${input.token}` } },
    );
    return data;
  }

  private async send<
    TReturn extends Record<string, unknown> = Record<string, unknown>,
  >(url: string, data: any, config: any): Promise<TReturn> {
    const response = await firstValueFrom<AxiosResponse>(
      this.httpService.post(url, data, config).pipe(
        catchError((error: AxiosError) => {
          throw new ServerException(ServerError.BadRequest, 'Bad request', {
            data: data,
            response: error.response.data,
          });
        }),
      ),
    );

    return response.data;
  }
}
