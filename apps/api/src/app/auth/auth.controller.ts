import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from "@superstore/libs";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @HttpCode(200)
    @Post('sign-up')
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto);
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
