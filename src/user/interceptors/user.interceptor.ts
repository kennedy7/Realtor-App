import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];

    return handler.handle();
  }
}
