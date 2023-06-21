import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { UpdateUserDto, UserDto } from "@superstore/interfaces";
import { FormControl, FormGroup } from "@angular/forms";
import { UserService } from "../user.service";

@Component({
    selector: 'superstore-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    user: UserDto;
    formUser = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
    });

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
    }

    ngOnInit() {
        this.user = this.authService.user;
        this.formUser.patchValue(this.user);
    }

    submitForm() {
        if (this.formUser.invalid) {
            return;
        }
        this.updateUser();
    }

    updateUser() {
        const { firstName, lastName, email } = this.formUser.value;

        const user: UpdateUserDto = {
            id: this.user.id,
            firstName,
            lastName,
            email,
            isAdmin: this.user.isAdmin,
        };

        this.userService.updateUser(user)
            .subscribe((user) => {
                this.user = user;
                this.formUser.patchValue(user);
            });
    }
}
