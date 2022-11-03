export type CommandModel = {
  id: string;
  command: string;
  dispatcher: 'client' | 'message';
  type: 'music' | 'message' | 'action';
  description: string;
  response?: string | null;
  message?: any;
};
