import { Component, OnInit } from '@angular/core';
import { ProductDto } from "@superstore/libs";
import { ProductService } from "../../../product/product.service";
import { NotificationsService } from "../../../shared/notifications/notifications.service";
import { AdminService } from "../../admin.service";

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[];
    editedProduct: ProductDto;

    constructor(
        private readonly productService: ProductService,
        private readonly notificationService: NotificationsService,
        public adminService: AdminService
    ) {
    }

    ngOnInit() {
        this.productService.getProducts(300, 1)
            .subscribe({
                next: ({ products }) => {
                    this.products = products;
                },
                error: (err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                }
            });
    }

    displayModalAddProduct() {
        this.adminService.openModal();
    }

    editProduct(product: ProductDto) {
        this.editedProduct = product;
        this.adminService.openModal();
    }

    deleteProduct(product: ProductDto) {
        this.productService.deleteProduct(product.id)
            .subscribe({
                next: () => {
                    this.products = this.products.filter(p => p.id !== product.id);
                    this.notificationService.showSuccessNotification('Success', 'Product deleted');
                },
                error: (err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                }
            });
    }
}
