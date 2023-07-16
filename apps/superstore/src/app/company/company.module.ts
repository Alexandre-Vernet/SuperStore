import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { WhoWeAreComponent } from './who-we-are/who-we-are.component';
import { RouterOutlet } from '@angular/router';
import { CompanyRoutingModule } from './company-routing.module';
import { PrivacyComponent } from './privacy/privacy.component';

@NgModule({
    declarations: [CompanyComponent, WhoWeAreComponent, PrivacyComponent],
    imports: [CommonModule, CompanyRoutingModule, RouterOutlet],
})
export class CompanyModule {
}
