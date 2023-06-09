import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { ResponsiveNavbarComponent } from './responsive-navbar/responsive-navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ProductPipe } from '../product/product.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
    declarations: [
        NavbarComponent,
        ResponsiveNavbarComponent,
        FooterComponent,
        NotificationsComponent,
        ProductPipe,
        LoaderComponent,
    ],
    imports: [CommonModule, RouterLink, FormsModule],
    exports: [
        NavbarComponent,
        ResponsiveNavbarComponent,
        FooterComponent,
        NotificationsComponent,
        LoaderComponent,
        ProductPipe,
    ],
})
export class SharedModule {
}
