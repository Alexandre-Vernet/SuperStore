import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from "../../../user/user.service";
import { UserDto } from "@superstore/interfaces";
import { SearchBar } from "../../search-bar/search-bar";

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
        private readonly userService: UserService
    ) {
    }

    ngOnInit() {
        this.userService.users
            .subscribe((users) => {
                this.users = users;
            });

        SearchBar.searchBar
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
