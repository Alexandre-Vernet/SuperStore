export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string[];
}


export class Product {
    static convertCentToEuro(price: number): number {
        return price / 100;
    }
}
