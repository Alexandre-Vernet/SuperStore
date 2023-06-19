export const environment = {
    production: true,
    backendUrl: 'https://superstore-api.onrender.com/api',
    productUri: () => `${ environment.backendUrl }/product`,
    orderUri: () => `${ environment.backendUrl }/order`,
    authUrl: () => `${ environment.backendUrl }/auth`,
    addressUrl: () => `${ environment.backendUrl }/address`,
    userUrl: () => `${ environment.backendUrl }/user`,
    reviewUrl: () => `${ environment.backendUrl }/review`,
    newsletterUrl: () => `${ environment.backendUrl }/newsletter`,
};
