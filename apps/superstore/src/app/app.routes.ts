import { Route } from '@angular/router';
import { authGuard } from "./auth/auth.guard";
import { adminGuard } from './admin/admin.guard';

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
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'order',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [adminGuard]
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [authGuard]
    },
    {
        path: 'company',
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule)
    },
    {
        path: 'customer-service',
        loadChildren: () => import('./customer-service/customer-service.module').then(m => m.CustomerServiceModule)
    },
    {
        path: '**',
        redirectTo: 'product',
        pathMatch: 'full'
    },
];
