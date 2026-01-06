import { PermissionProps } from '../../domain/interfaces/permission-props.interface';
import { PermissionTranslationInput } from './permission-translation.input';

export interface PermissionInput extends PermissionProps {
  translations: PermissionTranslationInput[];
}
