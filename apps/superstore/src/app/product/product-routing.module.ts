import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductComponent } from "./view-product/view-product.component";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";
import { SidebarFiltersComponent } from "./sidebar-filters/sidebar-filters.component";
import { ProductComponent } from "./product.component";

const routes: Routes = [
    {
        path: '',
        component: ProductComponent,
        canActivate: [OptionalAuthGuard],
        children: [
            {
                path: '',
                component: SidebarFiltersComponent,
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
