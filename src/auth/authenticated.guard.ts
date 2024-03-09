import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

const authRoutes = (request: any) : boolean => {
  if ((['/auth/verify', '/auth/login', '/auth/forgot-password', '/auth/reset-password'].includes(request.route.path)) && request.route.methods.post ) {
    return true; 
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (authRoutes(request)) {
      return true;
    }

    if (request && request.user && request.user.user) {
      const user = await this.usersService.findById(request.user.user._id);
      if (!user) {
        request.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
        });
        return false;  
      }
    }


    return request.isAuthenticated();
  }
}
