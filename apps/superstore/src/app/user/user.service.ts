import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { UpdateUserDto, UserDto } from "@superstore/interfaces";
import { environment } from "../../environments/environment";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    userUrl = environment.userUrl();
    users = new BehaviorSubject(<UserDto[]>[]);

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
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    getUser(userId: number): Observable<UserDto> {
        return this.http.get<UserDto>(`${ this.userUrl }/${ userId }`);
    }

    updateUser(user: UpdateUserDto): Observable<UserDto> {
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
                    this.authService.user = user;
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
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
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }
}
