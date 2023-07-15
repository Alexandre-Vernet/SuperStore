import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhoWeAreComponent } from "./who-we-are/who-we-are.component";
import { CompanyComponent } from "./company.component";

const routes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        children: [
            {
                path: '',
                redirectTo: 'who-we-are',
                pathMatch: 'full'
            },
            {
                path: 'who-we-are',
                component: WhoWeAreComponent
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule {
}
