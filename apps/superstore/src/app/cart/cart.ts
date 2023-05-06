export class Cart {
    static convertTwoDecimals(price: number): number {
        return Math.round(price * 100) / 100;
    }
}
