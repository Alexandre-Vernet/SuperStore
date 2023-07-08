export class CreateAddressDto {
    company?: string;
    address: string;
    apartment?: string;
    country: string;
    city: string;
    zipCode: string;
    phone: string;
}

export class AddressWithShortAddressDto extends CreateAddressDto {
    shortAddress: string;
}
