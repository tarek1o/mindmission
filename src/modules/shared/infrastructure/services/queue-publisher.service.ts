import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IQueuePublisherService } from '../../application/interfaces/queue-publisher-service.interface';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';

@Injectable()
export class QueuePublisherService implements IQueuePublisherService {
  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  private getQueue(queueName: string): Queue {
    try {
      const token = getQueueToken(queueName);
      return this.moduleRef.get<Queue>(token, { strict: false });
    } catch (error) {
      this.logger.error(`Failed to get queue "${queueName}": ${error.message}`, QueuePublisherService.name);
      throw new Error(`Failed to get queue "${queueName}". Make sure the queue is registered in the module.`);
    }
  }

  async publish<T>(queueName: string, data: T): Promise<void> {
    const queue = this.getQueue(queueName);
    const job = await queue.add('default', data);
    this.logger.log(`Job added to queue "${queueName}", jobId: ${job.id}, data: ${JSON.stringify(data)}`, QueuePublisherService.name);
  }
}