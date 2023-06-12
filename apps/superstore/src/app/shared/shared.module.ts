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
import { SearchBarComponent } from './navbar/search-bar/search-bar.component';
import { ChangeCurrencyComponent } from './currency/change-currency/change-currency.component';
import { CurrencyPipe } from "./currency/currency.pipe";

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
        CurrencyPipe
    ],
    imports: [CommonModule, RouterLink, FormsModule],
    exports: [
        NavbarComponent,
        ResponsiveNavbarComponent,
        FooterComponent,
        NotificationsComponent,
        LoaderComponent,
    ],
})
export class SharedModule {
}
