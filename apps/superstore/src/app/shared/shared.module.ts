import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { ResponsiveNavbarComponent } from './responsive-navbar/responsive-navbar.component';
import { FooterComponent } from "./footer/footer.component";

@NgModule({
    declarations: [
        NavbarComponent,
        ResponsiveNavbarComponent,
        FooterComponent
    ],
    imports: [CommonModule, RouterLink],
    exports: [
        NavbarComponent,
        ResponsiveNavbarComponent,
        FooterComponent
    ],
})
export class SharedModule {
}
