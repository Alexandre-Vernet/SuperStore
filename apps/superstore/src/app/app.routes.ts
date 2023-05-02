import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'product',
        pathMatch: 'full'
    },
    {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
    },
    {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
    }
];
