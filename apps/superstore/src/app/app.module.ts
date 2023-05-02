import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';
import { CartModule } from './cart/cart.module';
import { ProductProductPipe } from './product/product.pipe';
import { SharedModule } from "./shared/shared.module";

@NgModule({
    declarations: [AppComponent, ProductProductPipe],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
        HttpClientModule,
        SharedModule,
        ProductModule,
        CartModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
