import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { UserDto } from '@superstore/interfaces';
import { environment } from '../../environments/environment';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ErrorService } from '../error/error.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    userUrl = environment.userUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly notificationsService: NotificationsService,
        private readonly errorService: ErrorService
    ) {
    }

    getUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${ this.userUrl }`);
    }

    updateUser(user: Omit<UserDto, 'password'>): Observable<UserDto> {
        return this.http.put<UserDto>(`${ this.userUrl }/${ user.id }`, user)
            .pipe(
                catchError((err) => {
                    this.errorService.setError(err.error.message);
                    return of(null);
                })
            );
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${ this.userUrl }/${ userId }`)
            .pipe(
                catchError((err) => {
                    this.errorService.setError(err.error.message);
                    return of(null);
                })
            );
    }


    sendContactEmail(firstName: string, lastName: string, email: string, phone: string, subject: string, message: string) {
        return this.http.post<void>(`${ this.userUrl }/contact`, {
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
