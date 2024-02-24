import { Connection, Channel, connect, Message } from 'amqplib';
import { QueueRepository } from '../repositories/queue.repository';
import { QueuesNamesAndConsumers } from '../queue.module';

class RabbitMqRepository implements QueueRepository {
  private con: Connection;
  private channel: Channel;

  constructor(
    private uri: string,
    private queuesAndConsumers: QueuesNamesAndConsumers,
  ) {
    this.start(uri);
  }

  private async start(uri: string): Promise<void> {
    this.con = await connect(uri);
    this.channel = await this.con.createChannel();

    if (this.queuesAndConsumers) {
      const queues = Object.keys(this.queuesAndConsumers);

      queues.forEach((queue) => {
        const consume = this.queuesAndConsumers[queue];
        if (typeof consume === 'function') {
          this.consumeMessage(queue, (message) => {
            const messageInJSON = JSON.parse(message.content.toString());
            return consume(messageInJSON);
          });
        }
      });
    }
  }

  async sendMessage(queue: string, content: string): Promise<boolean> {
    return this.channel.publish('amq.direct', queue, Buffer.from(content));
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
