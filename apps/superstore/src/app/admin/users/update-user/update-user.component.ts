import { Component, Input, OnInit } from '@angular/core';
import { UserDto } from "@superstore/libs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdminService } from "../../admin.service";
import { UserService } from "../../../user/user.service";

@Component({
    selector: 'superstore-update-user',
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {

    @Input() editUser = {} as UserDto;

    formUpdateUser = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        isAdmin: new FormControl(false, [Validators.required]),
    });


    constructor(
        private readonly adminService: AdminService,
        private readonly userService: UserService,
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
            isAdmin
        })
            .subscribe(() => this.formUpdateUser.reset());

        this.closeModal();
    }

    closeModal() {
        this.adminService.closeModal();
    }
}
