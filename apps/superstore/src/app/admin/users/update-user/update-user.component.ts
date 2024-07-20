import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UserDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../user/user.service';

@Component({
    selector: 'superstore-update-user',
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

    @Input() editUser: UserDto;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    formUpdateUser = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        isAdmin: new FormControl(false, [Validators.required])
    });


    constructor(
        private readonly userService: UserService
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
            isAdmin: Boolean(isAdmin),
            addresses: this.editUser.addresses
        })
            .subscribe(() => this.closeModalAddProduct());
    }

    closeModalAddProduct() {
        this.formUpdateUser.reset();
        this.closeModal.emit();
    }

    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModalAddProduct();
    }
}
