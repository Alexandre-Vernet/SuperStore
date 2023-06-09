import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { AddressDto, CreateAddressDto, UserDto } from "@superstore/libs";
import { environment } from "../../environments/environment";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    userUrl = environment.userUrl();
    addressUrl = environment.addressUrl();
    users = new BehaviorSubject([] as UserDto[]);

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly notificationService: NotificationsService,
    ) {
        this.getUsers().subscribe();
    }

    getUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${ this.userUrl }`)
            .pipe(
                tap((users) => {
                    this.users.next(users);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    getUser(userId: number): Observable<UserDto> {
        return this.http.get<UserDto>(`${ this.userUrl }/${ userId }`);
    }

    updateUser(user: UserDto): Observable<UserDto> {
        return this.http.put<UserDto>(`${ this.userUrl }/${ user.id }`, user)
            .pipe(
                tap((user) => {
                    const users = this.users.value.map((p) => {
                        if (p.id === user.id) {
                            return user;
                        } else {
                            return p;
                        }
                    });
                    this.notificationService.showSuccessNotification('Success', 'User updated successfully');
                    this.users.next(users);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${ this.userUrl }/${ userId }`)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'User deleted successfully');
                    const users = this.users.value.filter((p) => p.id !== userId);
                    this.users.next(users);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    createAddress(address: CreateAddressDto): Observable<AddressDto> {
        return this.http.post<AddressDto>(this.addressUrl, address);
    }

    getAddresses(): Observable<AddressDto[]> {
        const userId = this.authService.user.id;
        return this.http.post<AddressDto[]>(`${ this.addressUrl }/find-all`, { userId });
    }

    getAddress(addressId: number): Observable<AddressDto> {
        return this.http.get<AddressDto>(`${ this.addressUrl }/${ addressId }`);
    }
}
