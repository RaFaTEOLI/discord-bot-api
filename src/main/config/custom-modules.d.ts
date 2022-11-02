declare module Express {
  interface Request {
    account?: {
      id: string;
      name: string;
      email: string;
    };
  }
}
