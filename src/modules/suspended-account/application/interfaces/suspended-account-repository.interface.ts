import { SuspendedReasonEnum } from "../../domain/enums/suspended-reason.enum";
import { SuspendedAccountModel } from "../../domain/models/suspended-account.model";

export interface ISuspendedAccountRepository {
  getByRecipientAndChannel(recipient: string, reason: SuspendedReasonEnum): Promise<SuspendedAccountModel | null>;
  save(suspendedAccount: SuspendedAccountModel, manager?: unknown): Promise<SuspendedAccountModel>;
  cleanupExpiredSuspensions(): Promise<void>;
  delete(suspendedAccount: SuspendedAccountModel, manager?: unknown): Promise<void>;
}