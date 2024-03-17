"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const sessions_service_1 = require("../sessions/sessions.service");
const authRoutes = (request) => {
    if ((['/auth/verify', '/auth/login', '/auth/forgot-password', '/auth/reset-password'].includes(request.route.path)) && request.route.methods.post) {
        return true;
    }
};
let AuthenticatedGuard = class AuthenticatedGuard {
    constructor(sessionService, reflector) {
        this.sessionService = sessionService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (authRoutes(request)) {
            return true;
        }
        if (!request.isAuthenticated()) {
            return false;
        }
        if (!request.session.userID) {
            const session_id = request.sessionID;
            try {
                await this.sessionService.attachUser(session_id, request.user._id);
            }
            catch (error) {
                console.log(error);
            }
        }
        const requiredRoles = this.reflector.get('roles', context.getHandler()) || [];
        if (requiredRoles.length === 0) {
            return true;
        }
        const user = request.user;
        if (!user) {
            request.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                }
            });
            return false;
        }
        console.log(requiredRoles);
        return requiredRoles.includes(user.role);
    }
};
exports.AuthenticatedGuard = AuthenticatedGuard;
exports.AuthenticatedGuard = AuthenticatedGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sessions_service_1.SessionsService,
        core_1.Reflector])
], AuthenticatedGuard);
//# sourceMappingURL=authenticated.guard.js.map