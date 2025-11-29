import { IBaseRepository } from "src/modules/shared/application/interfaces/base-repository.interface";
import { UserProfileFieldEnum } from "../../domain/enums/user-profile-field.enum";
import { UserProfileChangeModel } from "../../domain/models/user-profile-change.model";

export interface IUserProfileChangeRepository extends IBaseRepository<UserProfileChangeModel> {
  getById(id: number): Promise<UserProfileChangeModel | null>;
  getByUserId(userId: number): Promise<UserProfileChangeModel[]>;
  getByUserIdAndField(userId: number, field: UserProfileFieldEnum): Promise<UserProfileChangeModel | null>;
}