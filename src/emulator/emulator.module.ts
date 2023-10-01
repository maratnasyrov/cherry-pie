import { Module } from '@nestjs/common';
import { ServerModule } from '../server/server.module';
import { EmulatorService } from './emulator.service';
import { EmulatorGateway } from './emulator.gateway';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [ServerModule, SessionModule],
  providers: [EmulatorService, EmulatorGateway],
})
export class EmulatorModule {}
