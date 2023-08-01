import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '@superstore/interfaces';
import { EmailService } from "../email/email.service";
import { AuthInterceptor } from "../auth/auth.interceptor";

@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UserService,
        private readonly emailService: EmailService
    ) {
    }

    @UseInterceptors(AuthInterceptor)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @HttpCode(200)
    @Post('contact')
    sendContactEmail(@Body() body: {
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        subject: string,
        message: string
    }) {
        return this.emailService.sendContactEmail(body)
    }

    @UseInterceptors(AuthInterceptor)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
