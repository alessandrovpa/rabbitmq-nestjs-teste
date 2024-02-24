import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => QueueService)) private queueService: QueueService,
  ) {}

  createUserConsumer(createUserDto: CreateUserDto) {
    console.log('message received', createUserDto);
    return true;
  }

  async createUserProducer(createUserDto: CreateUserDto) {
    await this.queueService.sendMessage('user', JSON.stringify(createUserDto));
    return createUserDto;
  }
}
