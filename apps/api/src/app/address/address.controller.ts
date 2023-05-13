import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto, CreateAddressDto } from "@superstore/libs";

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {
    }

    @Post()
    create(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(createAddressDto);
    }

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
