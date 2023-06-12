import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductsComponent } from "./list-products/list-products.component";
import { ViewProductComponent } from "./view-product/view-product.component";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";

const routes: Routes = [
    {
        path: '',
        component: ListProductsComponent,
        canActivate: [OptionalAuthGuard]
    },
    {
        path: 'product/:id',
        component: ViewProductComponent,
        canActivate: [OptionalAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule {
}
