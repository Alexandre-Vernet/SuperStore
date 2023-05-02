import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductsComponent } from "./list-products/list-products.component";
import { ViewProductComponent } from "./view-product/view-product.component";

const routes: Routes = [
    {
        path: '',
        component: ListProductsComponent
    },
    {
        path: 'product/:id',
        component: ViewProductComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule {
}
