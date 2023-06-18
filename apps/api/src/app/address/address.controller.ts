import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto, CreateAddressDto } from "@superstore/interfaces";

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {
    }

    @Post()
    create(@Body() createAddressDto: CreateAddressDto): Promise<AddressDto> {
        return this.addressService.create(createAddressDto);
    }

    @HttpCode(200)
    @Post('/find-all')
    findAll(@Body() { userId }: { userId: number }) {
        return this.addressService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.addressService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAddressDto: AddressDto) {
        return this.addressService.update(+id, updateAddressDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.addressService.remove(+id);
    }
}
