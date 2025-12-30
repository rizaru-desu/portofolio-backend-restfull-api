import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
} from '@nestjs/common';
import { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const accept = req.headers.accept || '';

    // Jika browser → HTML
    if (accept.includes('text/html')) {
      const filePath = path.join(process.cwd(), 'client', '404.html');

      const html = fs.readFileSync(filePath, 'utf-8');
      return res.status(404).send(html);
    }

    // Jika API / JSON
    return res.status(404).json({
      success: false,
      statusCode: 404,
      error: 'Not Found',
      message: 'Endpoint not found',
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
