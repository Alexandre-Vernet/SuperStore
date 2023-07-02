import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductComponent } from "./view-product/view-product.component";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";
import { SidebarFiltersComponent } from "./sidebar-filters/sidebar-filters.component";

const routes: Routes = [
    {
        path: '',
        component: SidebarFiltersComponent,
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
