import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SignInUserDto, UserDto } from '@superstore/libs';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {
    }

    @HttpCode(200)
    @Post('sign-in')
    signIn(@Body() signInUserDto: SignInUserDto) {
        return this.usersService.signIn(signInUserDto);
    }

    @HttpCode(200)
    @Post('sign-in-with-access-token')
    signInWithAccessToken(@Body() { accessToken }: { accessToken: string }) {
        return this.usersService.signInWithAccessToken(accessToken);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
