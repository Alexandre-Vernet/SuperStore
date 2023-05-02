import { Product } from "../product/product";

export interface Cart extends Product {
    quantity: number;
}
