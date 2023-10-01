import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
