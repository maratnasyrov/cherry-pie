import { catchError, firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CreateInput, CreateReturn } from './session.interface';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { SessionError, SessionException } from './session.exception';
import { URL } from 'url';

@Injectable()
export class SessionService {
  constructor(private readonly httpService: HttpService) {}

  async create(input: CreateInput): Promise<CreateReturn> {
    const url = 'https://gamebeat-dev.releaseband.com/';

    const game = `game=${input.game}`;
    const player = `playerId=${input.playerId}`;
    const currency = `currency=${input.currency}`;
    const balance = `balance=${input.balance}`;

    const response = await firstValueFrom(
      this.httpService
        .get(`${url}/?${game}&${player}&${currency}&${balance}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new SessionException(SessionError.BadRequest, 'Bad request', {
              input,
              response: error.response.data,
            });
          }),
        ),
    );

    const gameUrl = new URL(response.request.res.responseUrl);
    const token = gameUrl.searchParams.get('token');

    if (!token) {
      throw new SessionException(
        SessionError.TokenNotFound,
        'Token not found',
        {
          input,
          responseUrl: response.request.res.responseUrl,
        },
      );
    }

    return { token };
  }
}
