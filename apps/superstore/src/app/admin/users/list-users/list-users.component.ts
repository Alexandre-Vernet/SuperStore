import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../user/user.service';
import { UserDto } from '@superstore/interfaces';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { AdminSearchBarComponent } from '../../search-bar/admin-search-bar/admin-search-bar.component';

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

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 25,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly userService: UserService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.userService.users$,
            AdminSearchBarComponent.searchBar
        ])
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(([users]) => users.sort((a, b) => a?.id - b?.id)),
                tap(([users]) => this.pagination.totalPage.next(Math.ceil(users.length / this.pagination.itemsPerPage)))
            )
            .subscribe(([users, search]) => {
                this.users = users;

                if (search) {
                    this.filteredUsers = users.filter(user =>
                        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
                        user.email.toLowerCase().includes(search.toLowerCase())
                    );
                }

                if (this.filteredUsers.length <= 0 || !search) {
                    this.filteredUsers = [...this.users];
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
            .subscribe();
    }

    openModalUpdateUser() {
        this.showModalAddProduct = true;
    }

    closeModal() {
        this.showModalAddProduct = false;
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
