import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    searchBar = new BehaviorSubject('');

    showModalAddProduct: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    openModal() {
        this.showModalAddProduct.next(true);
    }

    closeModal() {
        this.showModalAddProduct.next(false);
    }
}
