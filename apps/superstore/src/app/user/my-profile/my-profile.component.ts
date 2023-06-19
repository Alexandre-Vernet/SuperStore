import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { UserDto } from "@superstore/interfaces";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
    selector: 'superstore-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {

    user: UserDto;
    formUser = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
    });

    constructor(
        private readonly authService: AuthService
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
        const { firstName, lastName, email, password } = this.formUser.value;
        console.log({ firstName, lastName, email, password})
    }
}
