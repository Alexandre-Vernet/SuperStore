import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductModule } from "./product/product.module";

@NgModule({
    declarations: [AppComponent, NavbarComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
        ProductModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
