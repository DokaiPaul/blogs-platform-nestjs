import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
  constructor(private repo: BlogsQueryRepository) {}

  public async validate(blogId: string): Promise<boolean> {
    const blog = await this.repo.getBlogById(blogId);
    if (!blog) return false;

    return true;
  }
}

export function IsBlogExist(validationOptions?: ValidationOptions) {
  if (!validationOptions) {
    validationOptions = {};
  }
  if (!validationOptions.message) {
    validationOptions.message = 'The field does not exist';
  }
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBlogExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogExistConstraint,
    });
  };
}
