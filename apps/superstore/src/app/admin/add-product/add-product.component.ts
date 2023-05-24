import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductService } from "../../product/product.service";
import { NotificationsService } from "../../shared/notifications/notifications.service";
import { AdminService } from "../admin.service";

@Component({
    selector: 'superstore-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {

    formAddProduct = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required]),
        category: new FormControl('', [Validators.required]),
    });

    constructor(
        private readonly productService: ProductService,
        private readonly notificationService: NotificationsService,
        private readonly adminService: AdminService
    ) {
    }

    addProduct() {
        const {
            name,
            description,
            price,
            category
        } = this.formAddProduct.value;

        // Check if category is valid
        const isCategoryValid = this.checkCategory(category);
        if (!isCategoryValid) {
            return;
        }

        // Get all categories separated by comma
        const categories = category.split(',').map(c => c.trim());

        this.productService.addProduct({
            name,
            description,
            price,
            category: categories
        })
            .subscribe({
                next: () => {
                    this.formAddProduct.reset();
                    this.notificationService.showSuccessNotification('Success', 'Product added successfully');
                },
                error: (err) => {
                    this.notificationService.showErrorNotification('Error', err.message);
                }
            })
    }

    checkCategory(category: string): boolean {
        // Check if category is valid (only letters, numbers, comma and space)
        const categoryRegex = /^[a-zA-Z0-9, ]*$/;
        if (!categoryRegex.test(category)) {
            this.formAddProduct.setErrors({
                invalidCharacters: true
            });
            return false;
        }


        // Detect duplicate categories
        const categories = category.split(',').map(c => c.trim());
        categories.sort();
        for (let i = 0; i < categories.length - 1; i++) {
            if (categories[i] === categories[i + 1]) {
                this.formAddProduct.setErrors({
                    duplicateCategories: true
                });
                return false;
            }
        }

        return true;
    }

    closeModal() {
        this.adminService.closeModal();
    }

    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModal();
    }
}
