import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionsService } from 'src/sessions/sessions.service';
export declare class AuthenticatedGuard implements CanActivate {
    private sessionService;
    private reflector;
    constructor(sessionService: SessionsService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
