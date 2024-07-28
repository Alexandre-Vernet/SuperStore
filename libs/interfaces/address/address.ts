import { UserDto } from '../user/user';

export class AddressDto {
    id?: number;
    user: UserDto;
    company?: string;
    address: string;
    apartment?: string;
    country: string;
    city: string;
    zipCode: string;
    phone: string;
}
