import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../user/user.service';
import { UserDto } from '@superstore/interfaces';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { AdminSearchBarComponent } from '../../search-bar/admin-search-bar/admin-search-bar.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-users',
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, OnDestroy {

    users: UserDto[] = [];
    filteredUsers: UserDto[] = [];
    editedUser: UserDto;

    showModalAddProduct = false;

    noResultSearch = false;

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 25,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly userService: UserService,
        private readonly notificationsService: NotificationsService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.userService.getUsers(),
            AdminSearchBarComponent.searchBar
        ])
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(([users]) => users.sort((a, b) => a?.id - b?.id)),
                tap(([users]) => this.pagination.totalPage.next(Math.ceil(users.length / this.pagination.itemsPerPage)))
            )
            .subscribe(([users, search]) => {
                this.users = users;

                if (!search) {
                    this.filteredUsers = [...this.users];
                    this.noResultSearch = false;
                } else {
                    this.pagination.totalPage.next(0);

                    this.filteredUsers = users.filter(user =>
                        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
                        user.email.toLowerCase().includes(search.toLowerCase())
                    );

                    this.noResultSearch = this.filteredUsers.length === 0;
                }

                this.pagination.currentPage.next(1);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    editUser(user: UserDto) {
        this.editedUser = user;
        this.openModalUpdateUser();
    }

    deleteUser(user: UserDto) {
        this.userService.deleteUser(user.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.notificationsService.showSuccessNotification('Success', 'User deleted successfully');
                    this.users = this.users.filter((p) => p.id !== user.id);
                    this.filteredUsers = [...this.users];
                }
            });
    }

    openModalUpdateUser() {
        this.showModalAddProduct = true;
    }

    updateUser(updatedUser: UserDto) {
        this.showModalAddProduct = false;

        if (updatedUser) {
            const index = this.users.findIndex(o => o.id === updatedUser.id);
            this.users[index] = updatedUser;
            this.filteredUsers = [...this.users];
        }
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
