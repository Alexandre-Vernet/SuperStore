export class CurrencyDto {
    name: string;
    flag: string;
}

export const currencies: CurrencyDto[] = [
    {
        name: 'EUR',
        flag: 'assets/icons/flags/EU.png'
    },
    {
        name: 'USD',
        flag: 'assets/icons/flags/US.png'
    }
];
