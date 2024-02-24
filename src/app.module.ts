import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue/queue.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [QueueModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
