import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from "./create-address.dto";

export class AddressDto extends PartialType(CreateAddressDto) {
    id: number;
}
