export class UpdateUserDto {
    id: number;
    addressesId?: number[];
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
}
