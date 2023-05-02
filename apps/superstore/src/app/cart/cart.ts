import { Product } from "../product/product";

export interface Cart extends Product {
    quantity: number;
}

export class Cart {
    static convertTwoDecimals(price: number): number {
        return Math.round(price * 100) / 100;
    }
}
