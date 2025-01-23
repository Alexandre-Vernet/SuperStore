export const environment = {
    appName: 'SuperStore',
    production: true,
    STRIPE_PUBLIC_KEY: 'pk_test_51M1VxYECnmlfmkPG6CJ6JEsqo6akDeus9wdcy22ahNINQNM03jSy5c7NoHmn3j3rZoYA5JwSmWvIurF2lWWCuCH400PkRrcVFz',
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
