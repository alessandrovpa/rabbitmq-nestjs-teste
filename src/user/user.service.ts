import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => QueueService)) private queueService: QueueService,
  ) {}

  create(createUserDto: CreateUserDto) {
    console.log('usuário criado', createUserDto);
    return false;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createUserWithQueue(createUserDto: CreateUserDto) {
    await this.queueService.sendMessage('user', JSON.stringify(createUserDto));
    return createUserDto;
  }
}
