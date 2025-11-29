import { IBaseRepository } from "src/modules/shared/application/interfaces/base-repository.interface";
import { SuspendedReasonEnum } from "../../domain/enums/suspended-reason.enum";
import { SuspendedAccountModel } from "../../domain/models/suspended-account.model";

export interface ISuspendedAccountRepository extends IBaseRepository<SuspendedAccountModel> {
  getByRecipientAndChannel(recipient: string, reason: SuspendedReasonEnum): Promise<SuspendedAccountModel | null>;
  cleanupExpiredSuspensions(): Promise<void>;
  delete(suspendedAccount: SuspendedAccountModel, manager?: unknown): Promise<void>;
}