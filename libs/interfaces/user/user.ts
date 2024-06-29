import { AddressDto } from '../address/address';

export class UserDto {
    id: number;
    addresses?: AddressDto[];
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
}
