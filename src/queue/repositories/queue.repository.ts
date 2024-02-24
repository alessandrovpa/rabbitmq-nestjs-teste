export abstract class QueueRepository {
  abstract sendMessage(queue: string, message: string): Promise<boolean>;
  abstract consumeMessage(
    queue: string,
    callback: (message: any) => any,
  ): Promise<any>;
}
