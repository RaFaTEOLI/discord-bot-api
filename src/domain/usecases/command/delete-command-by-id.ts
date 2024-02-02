export type QueueDeleteCommandParams = {
  discordId: string;
};

export interface DeleteCommandById {
  deleteById: (id: string) => Promise<boolean>;
}
