export const environment = {
    production: true,
    backendUrl: 'https://superstore-api.onrender.com/api',
    productUri: () => `${ environment.backendUrl }/product`,
};
