import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from "@superstore/interfaces";

@Pipe({
    name: 'searchUsers'
})
export class UsersPipe implements PipeTransform {
    transform(search: string, users: UserDto[]): UserDto[] {
        return users?.filter(user => {
            return user.id.toString().includes(search.toLowerCase()) ||
                user.firstName.toLowerCase().includes(search.toLowerCase()) ||
                user.lastName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.isAdmin.toString().includes(search.toLowerCase());

        });
    }
}
