import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from './currency';

@Pipe({
    name: 'convertCurrency',
    pure: false
})
export class CurrencyPipe implements PipeTransform {
    transform(price: number) {
        // Get the currency from local storage
        const currency = localStorage.getItem(Currency.CURRENCY);
        if (currency) {
            // If currency is USD, convert to USD
            if (currency === Currency.USD) {
                return `$${ (price * 1.1).toFixed(2) }`;
            }
        } else {
            // If no currency is set, set it to EUR
            localStorage.setItem(Currency.CURRENCY, Currency.USD);
        }
        return `${ price } €`;
    }
}
