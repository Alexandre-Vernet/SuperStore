export class DeliveryMethod {
    name: DeliveryMethodType;
    expectedDelivery: DeliveryMethodExpectedDelivery;
    price: DeliveryMethodPrice;
}

export enum DeliveryMethodType {
    STANDARD = 'STANDARD',
    EXPRESS = 'EXPRESS',
}

export enum DeliveryMethodExpectedDelivery {
    STANDARD = '3-5 days',
    EXPRESS = '1-2 days',
}

export enum DeliveryMethodPrice {
    STANDARD = 5,
    EXPRESS = 16,
}

export const deliveryMethods: DeliveryMethod[] = [
    {
        name: DeliveryMethodType.STANDARD,
        expectedDelivery: DeliveryMethodExpectedDelivery.STANDARD,
        price: DeliveryMethodPrice.STANDARD,
    },
    {
        name: DeliveryMethodType.EXPRESS,
        expectedDelivery: DeliveryMethodExpectedDelivery.EXPRESS,
        price: DeliveryMethodPrice.EXPRESS,
    },
];
