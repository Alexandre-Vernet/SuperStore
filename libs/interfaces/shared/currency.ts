import { Currency } from '../../../apps/superstore/src/app/shared/currency/currency';

export class CurrencyDto {
    name: string;
    flag: string;
}

export const currencies: CurrencyDto[] = [
    {
        name: Currency.EUR,
        flag: 'assets/icons/flags/EU.png'
    },
    {
        name: Currency.USD,
        flag: 'assets/icons/flags/US.png'
    }
];
