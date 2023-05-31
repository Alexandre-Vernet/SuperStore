import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../user/user.service";
import { UserDto } from "@superstore/libs";
import { NotificationsService } from "../../../shared/notifications/notifications.service";
import { AdminService } from "../../admin.service";

@Component({
    selector: 'superstore-users',
    templateUrl: './list-users.component.html',
    styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {

    users: UserDto[] = [];
    editedUser: UserDto;

    constructor(
        private readonly userService: UserService,
        private readonly notificationService: NotificationsService,
        public adminService: AdminService
    ) {
    }

    ngOnInit() {
        this.userService.getUsers()
            .subscribe({
                next: (users) => {
                    this.users = users;
                },
                error: (err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                }
            });
    }

    editUser(user: UserDto) {
        this.editedUser = user;
        this.adminService.openModal();
    }

    deleteUser(user: UserDto) {
        this.userService.deleteUser(user.id)
            .subscribe({
                next: () => {
                    this.users = this.users.filter(u => u.id !== user.id);
                },
                error: (err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                }
            });
    }
}
