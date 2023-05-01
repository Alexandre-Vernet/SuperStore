import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { ViewCartComponent } from "./view-cart/view-cart.component";

@NgModule({
  declarations: [CartComponent, ViewCartComponent],
  imports: [CommonModule, CartRoutingModule],
})
export class CartModule {}
