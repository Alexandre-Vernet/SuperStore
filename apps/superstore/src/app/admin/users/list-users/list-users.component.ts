import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from "../../../user/user.service";
import { UserDto } from "@superstore/interfaces";
import { AdminService } from "../../admin.service";

@Component({
    selector: 'superstore-users',
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {

    users: UserDto[] = [];
    editedUser: UserDto;
    searchBar = '';
    showModalAddProduct = false;

    constructor(
        private readonly userService: UserService,
        private readonly adminService: AdminService
    ) {
    }

    ngOnInit() {
        this.userService.users
            .subscribe((users) => {
                this.users = users;
            });

        this.adminService.searchBar
            .subscribe((search) => {
                this.searchBar = search;
            });
    }

    openModal() {
        this.showModalAddProduct = true;
    }

    closeModal() {
        this.showModalAddProduct = false;
    }


    editUser(user: UserDto) {
        this.editedUser = user;
        this.openModal();
    }

    deleteUser(user: UserDto) {
        this.userService.deleteUser(user.id).subscribe();
    }

    // Escape key to clear search bar
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (this.searchBar.length > 0) {
            this.searchBar = '';
        }
    }
}
