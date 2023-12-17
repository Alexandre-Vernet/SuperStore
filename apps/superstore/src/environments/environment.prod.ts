export const environment = {
    production: true,
    backendUrl: 'http://superstore-api:3000/api',
    productUri: () => `${ environment.backendUrl }/product`,
    orderUri: () => `${ environment.backendUrl }/order`,
    authUrl: () => `${ environment.backendUrl }/auth`,
    addressUrl: () => `${ environment.backendUrl }/address`,
    userUrl: () => `${ environment.backendUrl }/user`,
    reviewUrl: () => `${ environment.backendUrl }/review`,
    newsletterUrl: () => `${ environment.backendUrl }/newsletter`,
    promotionCodeUrl: () => `${ environment.backendUrl }/promotion`,
};
