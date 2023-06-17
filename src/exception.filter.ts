import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: ErrorExceptionFilter, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.status(500).send('An internal Error has been occurred');
  }
}

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

      case 404:
        response.status(status).send(`Not found`);
        break;

      case 429:
        response.status(status).send(`Too much requests. Hold up!`);
        break;

      case 500:
        response.status(status).send('An internal Error has been occurred');
    }
  }
}
