import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

const authRoutes = (request: any) : boolean => {
  if (request.route.path === '/auth/login' && request.route.methods.post ) {
    return true; 
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (authRoutes(request)) {
      return true;
    }

    return request.isAuthenticated();
  }
}
