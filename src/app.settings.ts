import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './exception.filter';

const validationPipesOptions = {
  stopAtFirstError: true,
  exceptionFactory: (errors: ValidationError[]): void => {
    const errorsInfo = [];
    errors.forEach((e) => {
      const firstMessage = Object.keys(e.constraints)[0];
      errorsInfo.push({
        message: e.constraints[firstMessage],
        field: e.property,
      });
    });
    throw new BadRequestException(errorsInfo);
  },
};

export const appSettings = (app: INestApplication): void => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe(validationPipesOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
};
