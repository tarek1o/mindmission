import { CreateDateColumn, DeepPartial, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  constructor(partial?: DeepPartial<BaseEntity>) {
    Object.assign(this, partial);
  }
}