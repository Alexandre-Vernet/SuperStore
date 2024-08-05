import { Body, Controller, HttpCode, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserDto } from "@superstore/interfaces";
import { AuthService } from "./auth.service";
import { AuthInterceptor } from "./auth.interceptor";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @HttpCode(201)
    @Post('sign-up')
    signUp(@Body() createUserDto: UserDto){
        return this.authService.signUp(createUserDto);
    }

    @HttpCode(200)
    @Post('sign-in')
    signIn(@Body() signInUserDto: Pick<UserDto, 'email' | 'password'>) {
        return this.authService.signIn(signInUserDto);
    }

    @HttpCode(200)
    @Post('sign-in-with-access-token')
    async signInWithAccessToken(@Body() { accessToken }: { accessToken: string }) {
        return await this.authService.signInWithAccessToken(accessToken);
    }

    @UseInterceptors(AuthInterceptor)
    @Put('update-password')
    updatePassword(@Body() { userId, password, confirmPassword }: { userId: number, password: string, confirmPassword: string }) {
        return this.authService.updatePassword(userId, password, confirmPassword);
    }

    @HttpCode(200)
    @Post('send-email-reset-password')
    sendEmailForgotPassword(@Body() body: { email: string }) {
        return this.authService.sendEmailForgotPassword(body.email);
    }
}
