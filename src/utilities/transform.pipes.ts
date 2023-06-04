import { TransformFnParams } from 'class-transformer';

export const trimFn = ({ value }: TransformFnParams) => value?.trim();
