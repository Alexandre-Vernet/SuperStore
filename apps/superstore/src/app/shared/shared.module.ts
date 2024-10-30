import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { ResponsiveNavbarComponent } from './responsive-navbar/responsive-navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductPipe } from '../product/product.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { LoaderComponent } from './loader/loader.component';
import { SearchBarComponent } from './navbar/search-bar/search-bar.component';
import { ChangeCurrencyComponent } from './currency/change-currency/change-currency.component';
import { CustomCurrencyPipe } from './currency/currency.pipe';
import { UserMenuComponent } from './navbar/user-menu/user-menu.component';
import { CartIconComponent } from './navbar/cart-icon/cart-icon.component';
import { PdfService } from "./pdf/pdf.service";

@NgModule({
    declarations: [
        NavbarComponent,
        ResponsiveNavbarComponent,
        FooterComponent,
        NotificationsComponent,
        LoaderComponent,
        SearchBarComponent,
        ChangeCurrencyComponent,
        ProductPipe,
        CustomCurrencyPipe,
        UserMenuComponent,
        CartIconComponent,
    ],
    imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
    exports: [
        NavbarComponent,
        ResponsiveNavbarComponent,
        FooterComponent,
        NotificationsComponent,
        LoaderComponent,
        CustomCurrencyPipe,
    ],
    providers: [PdfService, DatePipe, CustomCurrencyPipe]
})
export class SharedModule {
}
