import { BaseModel } from "src/modules/shared/domain/models/base.model";
import { NotificationChannelEnum } from "../enums/notification-channel.enum";
import { NotificationProps } from "../interfaces/notification-props.interface";
import { NotificationStatusEnum } from "../enums/notification-status.enum";

export class NotificationModel extends BaseModel {
  channel: NotificationChannelEnum;
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
  messageId: string | null;
  status: NotificationStatusEnum;

  constructor(props: NotificationProps) {
    super(props);
    this.channel = props.channel;
    this.to = props.to;
    this.subject = props.subject;
    this.template = props.template;
    this.context = props.context;
    this.messageId = props.messageId;
    this.status = props.status ?? NotificationStatusEnum.PENDING;
  }

  override update(props: Partial<NotificationProps>): void {
    super.update(props);
    this.channel = props.channel ?? this.channel;
    this.to = props.to ?? this.to;
    this.subject = props.subject ?? this.subject;
    this.template = props.template ?? this.template;
    this.context = props.context ?? this.context;
    this.messageId = props.messageId ?? this.messageId;
    this.status = props.status ?? this.status;
  }
}