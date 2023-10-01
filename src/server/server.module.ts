import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { HttpModule } from '@nestjs/axios';
import { ServerController } from './server.controller';
import { ConfigModule } from '@nestjs/config';
import serverConfig from './server.config';

@Module({
  imports: [ConfigModule.forFeature(serverConfig), HttpModule],
  providers: [ServerService],
  exports: [ServerService],
  controllers: [ServerController],
})
export class ServerModule {}
