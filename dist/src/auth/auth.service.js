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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const mail_service_1 = require("../mail/mail.service");
const index_dto_1 = require("./dto/index.dto");
const sessions_service_1 = require("../sessions/sessions.service");
const otpGenerator = require('otp-generator');
let AuthService = class AuthService {
    constructor(usersService, mailService, sessionService) {
        this.usersService = usersService;
        this.mailService = mailService;
        this.sessionService = sessionService;
    }
    async forgotPassword(forgotPasswordReqDto) {
        const { name, email } = forgotPasswordReqDto;
        const user = await this.usersService.getUser(name);
        if (!user)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        if (user.email !== email) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        }
        const verificationCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const hash = await bcrypt.hash(verificationCode, 10);
        user.code = hash;
        user.expiresAt = new Date(Date.now() + 900000);
        try {
            await user.save();
            await this.mailService.sendResetPassword(user, verificationCode);
            return {
                message: 'An email has been sent to you with a 6-digit code for password reset',
                statusCode: common_1.HttpStatus.OK,
            };
        }
        catch (err) {
            throw new common_1.HttpException('Error sending email', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(resetPasswordDto) {
        const { name, code, password } = resetPasswordDto;
        const user = await this.usersService.getUser(name);
        if (!user)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        if (!user.code || !user.expiresAt) {
            throw new common_1.HttpException('Please go to forgot password first', common_1.HttpStatus.BAD_REQUEST);
        }
        const codeMatch = await bcrypt.compare(code, user.code);
        if (!codeMatch)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        if (user.expiresAt < new Date(Date.now())) {
            throw new common_1.HttpException('Code expired', common_1.HttpStatus.BAD_REQUEST);
        }
        const newPassword = await bcrypt.hash(password, 10);
        user.verified = true;
        user.password = newPassword;
        user.code = null;
        user.expiresAt = null;
        await user.save();
        return {
            message: 'Password reset successful',
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async verify(verifyDto, request) {
        const { name, code, password } = verifyDto;
        const user = await this.usersService.getUser(name);
        if (!user)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        if (user.verified) {
            throw new common_1.HttpException('Already verified', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!user.code || !user.expiresAt) {
            throw new common_1.HttpException('Please login first', common_1.HttpStatus.BAD_REQUEST);
        }
        const codeMatch = await bcrypt.compare(code, user.code);
        if (!codeMatch)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        if (user.expiresAt < new Date(Date.now())) {
            throw new common_1.HttpException('Code expired', common_1.HttpStatus.BAD_REQUEST);
        }
        const newPassword = await bcrypt.hash(password, 10);
        user.verified = true;
        user.password = newPassword;
        user.code = null;
        user.expiresAt = null;
        await user.save();
        let returned_user = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
        return new Promise((resolve, reject) => {
            request.login(user, (err) => {
                if (err) {
                    reject(err);
                }
                this.sessionService.attachUser(request.sessionID, user._id).then((session) => {
                });
                resolve(returned_user);
            });
        });
    }
    async validateUser(name, password) {
        const user = await this.usersService.getUser(name);
        if (!user)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        const passwordMatch = await this.passwordMatch(password, user.password);
        if (!passwordMatch)
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.BAD_REQUEST);
        if (!user.verified) {
            const verificationCode = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            const hash = await bcrypt.hash(verificationCode, 10);
            user.code = hash;
            user.expiresAt = new Date(Date.now() + 900000);
            await user.save();
            await this.mailService.sendEmailVerification(user, verificationCode);
            throw new common_1.HttpException('A 6-digit verification code has been sent to your email. Please check your email for verification.', common_1.HttpStatus.ACCEPTED);
        }
        return {
            user,
        };
    }
    async passwordMatch(password, hash) {
        return await bcrypt.compare(password, hash);
    }
    async login(request) {
        let { user } = request.user;
        await this.sessionService.attachUser(request.sessionID, user._id);
        const returned_user = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
        return returned_user;
    }
    async logout(request) {
        request.session.destroy(() => {
            return {
                message: 'Logout successful',
                statusCode: common_1.HttpStatus.OK,
            };
        });
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_dto_1.VerifyDto, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "verify", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "login", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "logout", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        mail_service_1.MailService,
        sessions_service_1.SessionsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map