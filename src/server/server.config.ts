import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  serverUrl: process.env.GAME_SERVER_URL || 'http://localhost:3000',
}));
