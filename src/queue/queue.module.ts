import { Module, forwardRef } from '@nestjs/common';
import { QueueRepository } from './repositories/queue.repository';
import { RabbitMqRepository } from './implementations/rabbitmq.repository';
import { QueueService } from './queue.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
const rabbitMqConnectionURI = 'amqp://guest:guest@localhost:5672';

interface QueuesNamesAndConsumers {
  [queueName: string]: (message: any) => boolean;
}

@Module({
  imports: [RabbitMqRepository, forwardRef(() => UserModule)],
  providers: [
    UserService,
    {
      provide: QueueRepository,
      useFactory: (userService: UserService) => {
        console.log('aqui', userService);
        const queuesAndConsumers: QueuesNamesAndConsumers = {
          user: (message) => userService.create(message),
        };

        return new RabbitMqRepository(
          rabbitMqConnectionURI,
          queuesAndConsumers,
        );
      },
      inject: [UserService],
    },
    {
      provide: QueueService,
      useFactory: (queueRepository: QueueRepository) => {
        return new QueueService(queueRepository);
      },
      inject: [QueueRepository],
    },
  ],
  exports: [QueueService],
})
export class QueueModule {}
