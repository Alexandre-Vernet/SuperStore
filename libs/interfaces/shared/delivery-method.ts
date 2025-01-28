export class DeliveryMethod {
    name: string;
    expectedDelivery: string;
    price: number;
}


export const deliveryMethods: DeliveryMethod[] = [
    {
        name: 'STANDARD',
        expectedDelivery: '3-5 days',
        price: 5
    },
    {
        name: 'EXPRESS',
        expectedDelivery: '1-2 days',
        price: 16
    }
];