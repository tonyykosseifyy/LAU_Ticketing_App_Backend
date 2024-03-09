import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/user-roles';

@Injectable()
export class RolesInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getClass());
    if (!requiredRoles) {
      return next.handle(); // No roles required at the class level
    }

    const { user } = context.switchToHttp().getRequest();
    
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new UnauthorizedException();
    }

    return next.handle();
  }
}
