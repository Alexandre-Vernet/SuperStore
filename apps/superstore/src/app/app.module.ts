import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';
import { CartModule } from './cart/cart.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking',
            scrollPositionRestoration: 'enabled'
        }),
        HttpClientModule,
        SharedModule,
        ProductModule,
        CartModule,
        AuthModule,
        UserModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
