import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductComponent } from './product.component';
import { ProductsHomeComponent } from './products-home/products-home.component';

const routes: Routes = [
    {
        path: 'product',
        component: ProductComponent,
        children: [
            {
                path: '',
                component: ProductsHomeComponent,
            },
            {
                path: ':slug',
                component: ViewProductComponent,
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule {
}
