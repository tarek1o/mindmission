import { GetAllUsersQueryInput } from "../inputs/get-all-users-query.input";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { AllowedUserOrderColumnsEnum } from "../enums/allowed-user-order-columns.enum";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { UserModel } from "../../domain/models/user.model"
import { GetAllUsersPaginatedViewModel } from "../view-models/get-all-users-paginated.view-model";
import { UserProfileInfoViewModel } from "../view-models/user-profile-info.view.model";
import { UserTypeEnum } from "../../domain/enums/user-type.enum";

export interface IUserRepository {
  getAllPaginatedWithTotalCount(query: GetAllUsersQueryInput, order: IOrder<AllowedUserOrderColumnsEnum>, pagination: Pagination): Promise<{models: GetAllUsersPaginatedViewModel[], count: number}>;
  getById(id: number): Promise<UserModel | null>;
  getByEmail(email: string): Promise<UserModel | null>;
  getByIdsAndUserType(ids: number[], type: UserTypeEnum): Promise<{id: number, types: UserTypeEnum[]}[]> ;
  getProfileById(id: number): Promise<UserProfileInfoViewModel | null>;
  getByEmailExceptId(email: string, id?: number): Promise<{id: number, email: string} | null>;
  save(userModel: UserModel, manager?: unknown): Promise<UserModel>;
}