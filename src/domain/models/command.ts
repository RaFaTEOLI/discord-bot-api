export type CommandModel = {
  id: string;
  command: string;
  dispatcher: string;
  type: string;
  description: string;
  response?: string | null;
  message?: any;
};
