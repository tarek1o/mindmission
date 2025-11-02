export interface IQueuePublisherService {
  publish<T>(queueName: string, data: T): Promise<void>;
}