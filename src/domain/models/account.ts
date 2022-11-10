export type AccountModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  spotify?: {
    accessToken: string;
    refreshToken: string;
  };
};

export type AccountCleanModel = Omit<AccountModel, 'password'>;
