import { Connection, Channel, connect, Message } from 'amqplib';
import { QueueRepository } from '../repositories/queue.repository';

interface QueuesCallbacksType {
  [queue: string]: (message: any) => boolean;
}

class RabbitMqRepository implements QueueRepository {
  private con: Connection;
  private channel: Channel;

  constructor(
    private uri: string,
    private queuesCallbacks: QueuesCallbacksType,
  ) {
    this.start(uri);
  }

  private async start(uri: string): Promise<void> {
    this.con = await connect(uri);
    this.channel = await this.con.createChannel();

    if (this.queuesCallbacks) {
      const queues = Object.keys(this.queuesCallbacks);

      queues.forEach(async (queue) => {
        const callback = this.queuesCallbacks[queue];
        if (typeof callback === 'function') {
          await this.consumeMessage(queue, (message) => {
            const messageInJSON = JSON.parse(message.content.toString());
            return callback(messageInJSON);
          });
        }
      });
    }
  }

  async sendMessage(queue: string, content: string): Promise<boolean> {
    return await this.channel.sendToQueue(queue, Buffer.from(content));
  }

  consumeMessage(
    queue: string,
    callback: (message: Message) => boolean,
  ): Promise<any> {
    return this.channel.consume(queue, (message) => {
      const wasSuccessfullyConsumed = callback(message);
      if (wasSuccessfullyConsumed) this.channel.ack(message);
      else this.channel.nack(message);
    });
  }
}

export { RabbitMqRepository };
