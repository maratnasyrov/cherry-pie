import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import {
  BetProps,
  BetReturn,
  CollectProps,
  GambleProps,
  GambleReturn,
  InitProps,
  InitReturn,
} from './server.interface';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServerError, ServerException } from './server.exception';
import serverConfig from './server.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class ServerService {
  constructor(
    @Inject(serverConfig.KEY)
    private readonly config: ConfigType<typeof serverConfig>,
    private readonly httpService: HttpService
  ) {}

  async init(input: InitProps): Promise<InitReturn> {
    const data = await this.send<InitReturn>(
      'init',
      { game: input.game },
      { headers: { Authorization: `Bearer ${input.token}` } }
    );

    return data;
  }

  async bet(input: BetProps): Promise<BetReturn> {
    const data = await this.send<BetReturn>(
      'command',
      { clientId: input.clientId, command: 'bet', payload: { bet: input.bet } },
      { headers: { Authorization: `Bearer ${input.token}` } }
    );

    return data;
  }

  async gamble(input: GambleProps): Promise<GambleReturn> {
    const data = await this.send<GambleReturn>(
      'command',
      {
        clientId: input.clientId,
        command: 'gamble',
        payload: { gambleId: input.gambleId },
      },
      { headers: { Authorization: `Bearer ${input.token}` } }
    );

    return data;
  }

  async collect(input: CollectProps): Promise<any> {
    const data = await this.send(
      'command',
      {
        clientId: input.clientId,
        command: 'collect',
      },
      { headers: { Authorization: `Bearer ${input.token}` } }
    );
    return data;
  }

  private async send<
    TReturn extends Record<string, unknown> = Record<string, unknown>,
  >(
    url: string,
    data: Record<string, unknown>,
    config: AxiosRequestConfig<any>
  ): Promise<TReturn> {
    const response = await firstValueFrom<AxiosResponse<TReturn>>(
      this.httpService
        .post(`${this.config.serverUrl}/gameplay/${url}`, data, config)
        .pipe(
          catchError((error: AxiosError) => {
            throw new ServerException(ServerError.BadRequest, 'Bad request', {
              data: data,
              response: error.response?.data,
            });
          })
        )
    );

    return response.data;
  }
}
