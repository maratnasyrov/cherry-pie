import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { HttpModule } from '@nestjs/axios';
import { ServerController } from './server.controller';

@Module({
  imports: [HttpModule],
  providers: [ServerService],
  exports: [ServerService],
  controllers: [ServerController],
})
export class ServerModule {}
