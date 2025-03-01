import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { AddressDto } from '@superstore/interfaces';
import { AddressService } from '../address.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-list-addresses',
    templateUrl: './list-addresses.component.html',
    styleUrls: ['./list-addresses.component.scss']
})
export class ListAddressesComponent implements OnInit, OnDestroy {
    addresses: AddressDto[] = [];
    @Output() selectedAddress$ = new BehaviorSubject<AddressDto>(null);
    @Output() cleanForm$ = new BehaviorSubject<void>(null);

    pageSize = 2;
    currentPage = 1;
    totalPage = 0;
    responsiveMode: boolean;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly addressService: AddressService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        this.addressService.findAllUserAddresses()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((addresses) => {
                this.addresses = addresses;
                this.emitSelectAddress(addresses[0]);
                this.totalPage = Math.ceil(this.addresses.length / this.pageSize);
            });

        window.addEventListener('resize', this.onResize.bind(this));
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        window.removeEventListener('resize', this.onResize.bind(this));
    }

    emitSelectAddress(address: AddressDto | null) {
        this.selectedAddress$.next(address);
    }

    removeAddress(address: AddressDto) {
        this.addressService.deleteAddress(address)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.notificationService.showSuccessNotification('Success', 'Address deleted successfully');
                    this.addresses = this.addresses.filter((p) => p.id !== address.id);
                }
            });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPage) {
            this.currentPage++;
        }
    }

    onResize(event) {
        this.responsiveMode = event.target.innerWidth < 640;
    }
}
