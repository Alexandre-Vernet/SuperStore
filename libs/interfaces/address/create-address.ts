export class CreateAddressDto {
    userId: number;
    company?: string;
    address: string;
    apartment?: string;
    country: string;
    city: string;
    postalCode: string;
    phone: string;
}
