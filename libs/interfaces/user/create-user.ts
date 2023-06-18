export class CreateUserDto {
    addressesId: number[];
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
}
