import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ClubsService } from 'src/users/users.service';

const authRoutes = (request: any) : boolean => {
  if ((['/auth/verify', '/auth/login', '/auth/forgot-password', '/auth/reset-password'].includes(request.route.path)) && request.route.methods.post ) {
    return true; 
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private clubsService: ClubsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (authRoutes(request)) {
      return true;
    }

    if (request && request.user && request.user.club) {
      const club = await this.clubsService.findById(request.user.club._id);
      if (!club) {
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
