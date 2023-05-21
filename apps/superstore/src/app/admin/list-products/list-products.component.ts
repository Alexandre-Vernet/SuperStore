import { Component, OnInit } from '@angular/core';
import { ProductDto } from "@superstore/libs";
import { ProductService } from "../../product/product.service";
import { NotificationsService } from "../../shared/notifications/notifications.service";

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[];

    constructor(
        private readonly productService: ProductService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        this.productService.getProducts(300, 1)
            .subscribe({
                next: ({ products }) => {
                    this.products = products;
                }
            })
    }

    deleteProduct(product: ProductDto) {
        this.productService.deleteProduct(product.id)
            .subscribe({
                next: () => {
                    this.products = this.products.filter(p => p.id !== product.id);
                },
                error: (err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                }
            })
    }
}
