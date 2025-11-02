import { BaseModel } from "src/modules/shared/domain/models/base.model";
import { NotificationChannelEnum } from "src/modules/notification/domain/enums/notification-channel.enum";
import { SuspendedReasonEnum } from "../enums/suspended-reason.enum";
import { SuspendedAccountProps } from "../interfaces/suspended-account-props.interface";

export class SuspendedAccountModel extends BaseModel {
  recipient: string;
  channel: NotificationChannelEnum;
  reason: SuspendedReasonEnum;
  suspendedUntil: Date;

  constructor(props: SuspendedAccountProps) {
    super(props);
    this.recipient = props.recipient;
    this.channel = props.channel;
    this.reason = props.reason;
    this.suspendedUntil = props.suspendedUntil;
  }

  isSuspended(): boolean {
    return this.remainingSuspensionTimeInSeconds() > 0;
  }

  remainingSuspensionTimeInSeconds(): number {
    const now = new Date();
    const diffTime = this.suspendedUntil.getTime() - now.getTime();
    const remainingTimeInSeconds = Math.ceil(diffTime / 1000);
    return remainingTimeInSeconds > 0 ? remainingTimeInSeconds : 0;
  }

  override update(props: Partial<SuspendedAccountProps>): void {
    super.update(props);
    this.recipient = props.recipient ?? this.recipient;
    this.channel = props.channel ?? this.channel;
    this.reason = props.reason ?? this.reason;
    this.suspendedUntil = props.suspendedUntil;
  }
}