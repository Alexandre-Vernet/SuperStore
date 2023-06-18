export class CreateAddressDto {
    userId: number;
    company?: string;
    address: string;
    apartment?: string;
    country: string;
    city: string;
    zipCode: string;
    phone: string;
}
