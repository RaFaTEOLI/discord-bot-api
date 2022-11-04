import { AccountCleanModel } from '@/domain/models/account';

export type HttpResponse = {
  statusCode: number;
  body: any;
};

export type HttpRequest = {
  body?: any;
  headers?: any;
  params?: any;
  query?: any;
  account?: AccountCleanModel;
};
