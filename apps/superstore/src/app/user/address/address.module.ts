import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAddressesComponent } from './list-addresses/list-addresses.component';
import { CreateAddressComponent } from './create-address/create-address.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [ListAddressesComponent, CreateAddressComponent],
    exports: [
        ListAddressesComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class AddressModule {
}
