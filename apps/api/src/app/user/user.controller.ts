import { Body, Controller, Delete, Get, Param, Put, } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '@superstore/libs';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {
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
