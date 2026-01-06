import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/modules/shared/infrastructure/database/entities/base.entity';
import { CategoryTypeEnum } from 'src/modules/category/domain/enums/category-type.enum';
import { CategoryTranslationEntity } from './category-translation.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ name: 'type', type: 'varchar', length: 255 })
  type: CategoryTypeEnum;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number | null;

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: CategoryEntity | null;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];

  @OneToMany(
    () => CategoryTranslationEntity,
    (translation) => translation.category,
  )
  translations: CategoryTranslationEntity[];

  constructor(category?: DeepPartial<CategoryEntity>) {
    super(category);
    Object.assign(this, category);
  }
}
