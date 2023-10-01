import { Logger, Module } from '@nestjs/common';
import { ServerModule } from './server/server.module';
import { EmulatorModule } from './emulator/emulator.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ServerModule, EmulatorModule],
  providers: [Logger],
})
export class AppModule {}
