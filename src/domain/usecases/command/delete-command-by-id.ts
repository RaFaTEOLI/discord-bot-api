export interface DeleteCommandById {
  deleteById: (id: string) => Promise<boolean>;
}
