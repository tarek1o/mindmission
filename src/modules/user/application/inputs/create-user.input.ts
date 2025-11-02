export class CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone?: string;
  whatsAppNumber?: string;
  rolesIds: number[];
}