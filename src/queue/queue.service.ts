import { QueueRepository } from './repositories/queue.repository';

class QueueService {
  constructor(private queueRepository: QueueRepository) {}

  async sendMessage(queue: string, content: string) {
    await this.queueRepository.sendMessage(queue, content);
    return true;
  }
}

export { QueueService };
