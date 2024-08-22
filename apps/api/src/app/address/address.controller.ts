import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from '@superstore/interfaces';
import { AuthInterceptor } from '../auth/auth.interceptor';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {
    }

    @UseInterceptors(AuthInterceptor)
    @Post()
    create(@Body() address: AddressDto): Promise<AddressDto> {
        return this.addressService.create(address);
    }

    @UseInterceptors(AuthInterceptor)
    @Post('/find-all')
    findAllUserAddress(@Body() { userId }: { userId: number }) {
        return this.addressService.getUserAddresses(userId);
    }

    @UseInterceptors(AuthInterceptor)
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.addressService.find(id);
    }

    @UseInterceptors(AuthInterceptor)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateAddressDto: AddressDto): Promise<AddressDto> {
        return this.addressService.update(id, updateAddressDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.addressService.remove(id);
    }
}
