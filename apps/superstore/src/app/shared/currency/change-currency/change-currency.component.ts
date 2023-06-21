import { Component, OnInit } from '@angular/core';
import { currencies, CurrencyDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-change-currency',
    templateUrl: './change-currency.component.html',
    styleUrls: ['./change-currency.component.scss'],
})
export class ChangeCurrencyComponent implements OnInit {

    currencies = currencies;
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
