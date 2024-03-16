import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { UserRole } from './user-roles';

const authRoutes = (request: any) : boolean => {
  if ((['/auth/verify', '/auth/login', '/auth/forgot-password', '/auth/reset-password'].includes(request.route.path)) && request.route.methods.post ) {
    return true; 
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    if (authRoutes(request)) {
      return true;
    }
    

    if (!request.isAuthenticated()) {
      return false; // Stop here if user is not authenticated
    }
    // if (!request.session.userID) {
    //   console.log(request.user);
    //   console.log(`user id: ${request.user._id}`);
      
    //   request.session.userID = request.user._id;
    //   request.session.save((err) => {
    //     if (err) {
    //       console.error('Session save error:', err);
    //     } else {
    //       console.log('Session saved successfully');
    //     }
    //   });

    // }
    

    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler()) || [];
    if (requiredRoles.length === 0) {
      return true; // No specific roles required, authenticated user is enough
    }

    // console.log('request.user', request.user);
    const user = request.user ;
    
    if (!user) {
      request.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
      });
      return false;
    }
    console.log(requiredRoles)
    return requiredRoles.includes(user.role); // Check if user's role matches any of the required roles
  }
}
