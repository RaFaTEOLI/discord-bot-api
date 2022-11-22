export interface DeleteCommandByIdRepository {
  deleteById: (id: string) => Promise<boolean>;
}
