import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignInUserDto } from "@superstore/libs";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @HttpCode(200)
    @Post('sign-in')
    signIn(@Body() signInUserDto: SignInUserDto) {
        return this.authService.signIn(signInUserDto);
    }

    @HttpCode(200)
    @Post('sign-in-with-access-token')
    signInWithAccessToken(@Body() { accessToken }: { accessToken: string }) {
        return this.authService.signInWithAccessToken(accessToken);
    }
}
