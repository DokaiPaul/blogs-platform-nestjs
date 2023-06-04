import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();

    switch (status) {
      case 400:
        const errors = {
          errorsMessages: [],
        };

        const errorsInfo: any = exception.getResponse();
        errorsInfo.message.forEach((m) => errors.errorsMessages.push(m));

        response.status(status).json(errors);
        break;

      case 401:
        response.status(status).send('Unauthorized');
        break;

      case 403:
        response.status(status).send(`You don't have the permissions`);
        break;
    }
  }
}

export const validationPipesOptions = {
  stopAtFirstError: true,
  exceptionFactory(errors) {
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