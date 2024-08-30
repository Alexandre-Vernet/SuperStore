export const environment = {
    appName: 'SuperStore',
    production: true,
    backendUrl: 'https://superstore-api.alexandre-vernet.fr/api',
    productUri: () => `${ environment.backendUrl }/product`,
    orderUri: () => `${ environment.backendUrl }/order`,
    authUrl: () => `${ environment.backendUrl }/auth`,
    addressUrl: () => `${ environment.backendUrl }/address`,
    userUrl: () => `${ environment.backendUrl }/user`,
    reviewUrl: () => `${ environment.backendUrl }/review`,
    newsletterUrl: () => `${ environment.backendUrl }/newsletter`,
    promotionCodeUrl: () => `${ environment.backendUrl }/promotion`,
};
