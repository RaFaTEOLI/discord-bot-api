import env from '@/main/config/env';

export const makeDiscordApplicationApiUrl = (path: string): string => {
  const applicationId = env.discordApplicationId;
  const apiUrl = `https://discord.com/api/v10/applications/${applicationId}`;

  if (path.startsWith('/')) {
    return `${apiUrl}${path}`;
  }
  return `${apiUrl}/${path}`;
};
