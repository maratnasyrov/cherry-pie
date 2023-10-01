import { Logger, Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { EmulatorModule } from './emulator/emulator.module';

@Module({
  imports: [ServerModule, EmulatorModule],
  providers: [Logger],
})
export class AppModule {}
