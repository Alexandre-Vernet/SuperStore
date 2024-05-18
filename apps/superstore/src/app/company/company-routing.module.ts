import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhoWeAreComponent } from "./who-we-are/who-we-are.component";
import { CompanyComponent } from "./company.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";

const routes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        canActivate: [OptionalAuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'who-we-are',
                pathMatch: 'full'
            },
            {
                path: 'who-we-are',
                component: WhoWeAreComponent
            },
            {
                path: 'privacy',
                component: PrivacyComponent
            },
            {
                path: 'terms-and-conditions',
                component: TermsAndConditionsComponent
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
