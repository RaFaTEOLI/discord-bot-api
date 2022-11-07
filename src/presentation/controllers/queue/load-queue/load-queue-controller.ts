import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { Controller, HttpResponse, LoadQueue } from './load-queue-controller-protocols';

export class LoadQueueController implements Controller {
  constructor(private readonly loadQueue: LoadQueue) {}

  async handle(): Promise<HttpResponse> {
    try {
      const queue = await this.loadQueue.load();
      if (!queue.length) {
        return noContent();
      }
      return success(queue);
    } catch (error) {
      return serverError(error);
    }
  }
}
