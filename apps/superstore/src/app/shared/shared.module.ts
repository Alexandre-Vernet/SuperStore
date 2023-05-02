import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterLink } from "@angular/router";
import { ResponsiveNavbarComponent } from "./responsive-navbar/responsive-navbar.component";

@NgModule({
    declarations: [NavbarComponent, ResponsiveNavbarComponent],
    imports: [CommonModule, RouterLink],
    exports: [NavbarComponent, ResponsiveNavbarComponent]
})
export class SharedModule {
}
