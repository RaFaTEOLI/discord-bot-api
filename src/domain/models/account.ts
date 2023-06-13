export type AccountModel = {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  accessToken?: string;
  spotify?: {
    accessToken: string;
    refreshToken?: string;
  };
  discord?: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
  };
};

export type AccountCleanModel = Omit<AccountModel, 'password'>;
