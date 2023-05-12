export const environment = {
    production: false,
    backendUrl: 'http://localhost:3000/api',
    productUri: () => `${ environment.backendUrl }/product`,
    orderUri: () => `${ environment.backendUrl }/order`,
    authUrl: () => `${ environment.backendUrl }/users`,
};
