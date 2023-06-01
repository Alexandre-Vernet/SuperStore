import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from "../../../user/user.service";
import { UserDto } from "@superstore/libs";
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

    constructor(
        private readonly userService: UserService,
        public adminService: AdminService
    ) {
    }

    ngOnInit() {
        this.userService.users
            .subscribe((users) => {
                this.users = users;
            });
    }

    editUser(user: UserDto) {
        this.editedUser = user;
        this.adminService.openModal();
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
