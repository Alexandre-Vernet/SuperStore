import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseInterceptors, } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from "@superstore/interfaces";
import { AuthInterceptor } from "../auth/auth.interceptor";

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {
    }

    @UseInterceptors(AuthInterceptor)
    @Post()
    create(@Body() body: { address: AddressDto, userId: number }): Promise<AddressDto> {
        return this.addressService.create(body.address);
    }

    @HttpCode(200)
    @Post('/find-all')
    findAllUserAddress(@Body() { userId }: { userId: number }) {
        return this.addressService.findAllUserAddress(userId);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.addressService.findOne(id);
    }

    @UseInterceptors(AuthInterceptor)
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateAddressDto: AddressDto) {
        return this.addressService.update(id, updateAddressDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.addressService.remove(id);
    }
}
