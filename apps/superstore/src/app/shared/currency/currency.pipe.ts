import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertCurrency',
    pure: false
})
export class CurrencyPipe implements PipeTransform {
    transform(price: number) {
        // Get the currency from local storage
        const currency = localStorage.getItem('currency');
        if (currency) {
            // If currency is USD, convert to USD
            if (currency === 'USD') {
                return `$${ (price * 1.1).toFixed(2) }`;
            }
        } else {
            // If no currency is set, set it to EUR
            localStorage.setItem('currency', 'EUR');
        }
        return `${ price } €`;
    }
}
