import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
    },
];
