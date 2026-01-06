export interface GetAllRolesByLanguageViewModel {
  id: number;
  name: string;
  description: string | null;
  isDeletable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
