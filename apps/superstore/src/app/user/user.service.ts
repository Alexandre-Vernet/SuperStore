import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { UserDto } from '@superstore/interfaces';
import { environment } from '../../environments/environment';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from '../error/error.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    userUrl = environment.userUrl();
    private usersSubject = new BehaviorSubject(<UserDto[]>[]);
    users$ = this.usersSubject.asObservable();

    constructor(
        private readonly http: HttpClient,
        private readonly notificationsService: NotificationsService,
        private readonly authService: AuthService,
        private readonly errorService: ErrorService
    ) {
        this.getUsers().subscribe();
    }

    getUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${ this.userUrl }`)
            .pipe(
                tap((users) => {
                    this.usersSubject.next(users);
                })
            );
    }

    updateUser(user: Omit<UserDto, 'password'>): Observable<UserDto> {
        return this.http.put<UserDto>(`${ this.userUrl }/${ user.id }`, user)
            .pipe(
                tap((updatedUser) => {
                    const users = this.usersSubject.value.map(p =>
                        p.id === updatedUser.id ? updatedUser : p
                    );
                    this.usersSubject.next(users);
                    if (updatedUser.id === this.authService.user.id) {
                        this.authService.user = updatedUser;
                        this.notificationsService.showSuccessNotification('Success', 'Your profile has been updated');
                    } else {
                        this.notificationsService.showSuccessNotification('Success', 'User updated successfully');
                    }
                }),
                catchError((err) => {
                    this.errorService.setError(err.error.message);
                    return of(null);
                })
            );
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${ this.userUrl }/${ userId }`)
            .pipe(
                tap(() => {
                    const users = this.usersSubject.value.filter((p) => p.id !== userId);
                    this.usersSubject.next(users);

                    if (userId === this.authService.user.id) {
                        this.authService.signOut();
                        localStorage.clear();
                        this.notificationsService.showSuccessNotification('Success', 'Your account has been deleted');
                    } else {
                        this.notificationsService.showSuccessNotification('Success', 'User deleted successfully');
                    }
                }),
                catchError((err) => {
                    this.errorService.setError(err.error.message);
                    return of(null);
                })
            );
    }


    sendContactEmail(firstName: string, lastName: string, email: string, phone: string, subject: string, message: string) {
        return this.http.post(`${ this.userUrl }/contact`, {
            firstName,
            lastName,
            email,
            phone,
            subject,
            message
        })
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'Your message has been sent');
                }),
                catchError((err) => {
                        this.notificationsService.showErrorNotification('Error', err.error.message);
                        return of(null);
                    }
                )
            );
    }
}
