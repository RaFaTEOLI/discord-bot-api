export type SpotifyAccessModel = {
  access_token: string;
  token_type: 'Bearer';
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export type SpotifyUserModel = {
  id: string;
  email: string;
  display_name: string;
  country?: string;
  images?: [
    {
      height: string | null;
      url: string | null;
      width: string | null;
    }
  ];
};
