import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerServiceComponent } from "./customer-service.component";
import { ContactComponent } from "./contact/contact.component";

const routes: Routes = [
    {
        path: '',
        component: CustomerServiceComponent,
        children: [
            {
                path: 'contact',
                component: ContactComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerServiceRoutingModule {
}
