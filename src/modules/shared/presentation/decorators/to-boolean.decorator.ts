import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform(({ value }) => {
    if (value?.toLowerCase() === 'true') return true;
    if (value?.toLowerCase() === 'false') return false;
    return value;
  });
}
