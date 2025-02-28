import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-update-user',
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit, OnDestroy {

    @Input() editUser: UserDto;

    formUpdateUser = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        isAdmin: new FormControl(false, [Validators.required])
    });

    @Output() updateUser$ = new Subject<UserDto>();
    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly userService: UserService,
        private readonly notificationsService: NotificationsService
    ) {
    }

    ngOnInit() {
        if (this.editUser?.id) {
            this.formUpdateUser.setValue({
                firstName: this.editUser.firstName,
                lastName: this.editUser.lastName,
                email: this.editUser.email,
                isAdmin: this.editUser.isAdmin
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    updateUser() {
        const {
            firstName,
            lastName,
            email,
            isAdmin
        } = this.formUpdateUser.value;

        this.userService.updateUser({
            id: this.editUser.id,
            firstName,
            lastName,
            email,
            isAdmin: Boolean(isAdmin),
            addresses: this.editUser.addresses
        })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (user) => {
                    this.notificationsService.showSuccessNotification('Success', 'Order updated successfully');
                    this.formUpdateUser.reset();
                    this.updateUser$.next(user);
                },
                error: (err) => this.formUpdateUser.setErrors({
                    [err.error.field ? err.error.field : 'firstName']: err.error.field,
                    error: err.error.message
                })
            });
    }

    closeModalAddProduct() {
        this.formUpdateUser.reset();
        this.updateUser$.next(null);
    }

    @HostListener('document:keydown.escape', ['$event'])
    onKeydownEscapeHandler() {
        this.closeModalAddProduct();
    }

    @HostListener('document:keydown.control.enter', ['$event'])
    onKeydownControlEnterHandler() {
        this.updateUser();
    }
}
