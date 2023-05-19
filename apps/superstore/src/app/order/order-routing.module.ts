import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmOrderComponent } from "./confirm-order/confirm-order.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
    {
        path: '',
        component: ConfirmOrderComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule {
}
