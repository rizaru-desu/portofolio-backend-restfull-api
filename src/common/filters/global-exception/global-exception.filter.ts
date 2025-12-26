import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { APIError } from 'better-auth/api';

// Interface helpers
interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof APIError) {
      status = exception.status
        ? Number(exception.status)
        : HttpStatus.BAD_REQUEST;
      message = exception.message || 'Authentication Error';
      code = this.generateCode(message);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resBody = exception.getResponse();

      if (this.isErrorResponse(resBody)) {
        if (Array.isArray(resBody.message)) {
          message = resBody.message[0];
          code = 'VALIDATION_ERROR';
        } else {
          message = resBody.message;
          code = resBody.error
            ? this.generateCode(resBody.error)
            : 'HTTP_ERROR';
        }
      } else if (typeof resBody === 'string') {
        message = resBody;
        code = 'HTTP_ERROR';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = 'UNKNOWN_ERROR';
    }

    this.logger.error(`[${code}] ${message}`);

    // --- DISINI KUNCINYA ---
    // Kita membuat object baru HANYA dengan code dan message.
    // Apapun properti lain (seperti statusCode) yang ada di error asli akan TERBUANG.
    response.status(status).json({
      code: code,
      message: message,
    });
  }

  private isErrorResponse(obj: unknown): obj is ErrorResponse {
    return typeof obj === 'object' && obj !== null && 'message' in obj;
  }

  private generateCode(msg: string): string {
    return msg
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '_');
  }
}
