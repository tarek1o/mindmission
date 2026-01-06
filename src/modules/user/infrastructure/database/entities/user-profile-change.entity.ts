import {
  Column,
  DeepPartial,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';
import { RequestStatusEnum } from 'src/modules/user/domain/enums/request-status.enum';
import { UserProfileFieldEnum } from 'src/modules/user/domain/enums/user-profile-field.enum';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_profile_changes' })
@Index(
  'user_profile_changes_user_id_field_partial_unique_index',
  ['userId', 'field'],
  {
    unique: true,
    where: `"status" = '${RequestStatusEnum.PENDING}'`,
  },
)
export class UserProfileChangeEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'field', type: 'varchar', length: 255 })
  field: UserProfileFieldEnum;

  @Column({ name: 'old_value', type: 'text' })
  oldValue: string;

  @Column({ name: 'new_value', type: 'text' })
  newValue: string;

  @Column({ name: 'status', type: 'varchar', length: 255 })
  status: RequestStatusEnum;

  @Column({ name: 'status_changed_at', type: 'timestamp', nullable: true })
  statusChangedAt: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.profileChanges, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  constructor(change?: DeepPartial<UserProfileChangeEntity>) {
    super(change);
    Object.assign(this, change);
  }
}
