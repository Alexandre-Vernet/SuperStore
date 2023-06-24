import { Component, OnInit } from '@angular/core';
import { AddressDto, deliveryMethods } from "@superstore/interfaces";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AddressService } from "../../address/address.service";

@Component({
    selector: 'superstore-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {

    addresses: AddressDto[] = [];
    formAddress = new FormGroup({
        company: new FormControl(),
        address: new FormControl('', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        deliveryMethod: new FormControl('', [Validators.required]),
        paymentMethod: new FormControl('CB', [Validators.required]),
    });

    constructor(
        private readonly addressService: AddressService
    ) {
    }

    ngOnInit() {
        this.addressService.getUserAddresses()
            .subscribe(addresses => {
                this.addresses = addresses;
            });
    }

    clearFormAddress() {
        this.formAddress.reset();
        this.formAddress.patchValue({
            paymentMethod: 'CB',
            deliveryMethod: deliveryMethods[0].name,
        });
    }

    removeAddress(address: AddressDto) {
        this.addressService.deleteAddress(address)
            .subscribe(() => {
                this.addresses = this.addresses.filter(a => a.id !== address.id);
            });
    }
}
