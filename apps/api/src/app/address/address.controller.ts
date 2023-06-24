import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto, CreateAddressDto } from "@superstore/interfaces";

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {
    }

    @Post()
    create(@Body() body: { address: CreateAddressDto, userId: number }): Promise<AddressDto> {
        return this.addressService.create(body.address, body.userId);
    }

    @HttpCode(200)
    @Post('/find-all')
    findAllUserAddress(@Body() { userId }: { userId: number }) {
        return this.addressService.findAllUserAddress(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.addressService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateAddressDto: AddressDto) {
        return this.addressService.update(id, updateAddressDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.addressService.remove(id);
    }
}
