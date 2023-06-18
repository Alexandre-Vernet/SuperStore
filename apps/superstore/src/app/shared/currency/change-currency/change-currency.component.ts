import { Component, OnInit } from '@angular/core';
import { CurrencyDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-change-currency',
    templateUrl: './change-currency.component.html',
    styleUrls: ['./change-currency.component.scss'],
})
export class ChangeCurrencyComponent implements OnInit {

    currencies: CurrencyDto[] = [
        {
            name: 'EUR',
            flag: 'assets/icons/flags/EU.png'
        },
        {
            name: 'USD',
            flag: 'assets/icons/flags/US.png'
        }
    ];
    currentCurrency: CurrencyDto;

    ngOnInit(): void {
        const currency = localStorage.getItem('currency');
        if (currency) {
            this.currentCurrency = this.currencies.find(c => c.name === currency);
        } else {
            this.currentCurrency = this.currencies[0];
        }
    }

    changeCurrency(currency: string): void {
        this.currentCurrency = this.currencies.find(c => c.name === currency);
        localStorage.setItem('currency', currency);
    }
}
