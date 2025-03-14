import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response  = context.getResponse<Response>();

    const exceptionResponse = typeof exception.getResponse() === 'string' ? {message: exception.getResponse()} : exception.getResponse() as object
    const status = exception.getStatus()

    response.status(status).json({
       ...exceptionResponse,
       timeStamp: new Date().getTime()
    })
  }
}
