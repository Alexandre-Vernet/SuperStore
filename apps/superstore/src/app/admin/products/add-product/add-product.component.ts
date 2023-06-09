import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductService } from "../../../product/product.service";
import { AdminService } from "../../admin.service";
import { ProductDto } from "@superstore/libs";

@Component({
    selector: 'superstore-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {

    @Input() editProduct = {} as ProductDto | null;

    formAddProduct = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required]),
        category: new FormControl('', [Validators.required]),
    });

    constructor(
        private readonly productService: ProductService,
        private readonly adminService: AdminService
    ) {
    }

    ngOnInit() {
        if (this.editProduct?.id) {
            this.formAddProduct.setValue({
                name: this.editProduct.name,
                description: this.editProduct.description,
                price: this.editProduct.price,
                category: this.editProduct.category.join(', ')
            });
        }
    }

    submitForm() {
        const {
            name,
            description,
            price,
            category
        } = this.formAddProduct.value;

        if (this.editProduct?.id) {
            this.updateProduct({
                name,
                description,
                price,
                category
            });
        } else {
            this.addProduct({
                name,
                description,
                price,
                category
            });
        }
    }

    addProduct({ name, description, price, category }) {
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
        }).subscribe(() => this.formAddProduct.reset());
        this.closeModal();
    }

    updateProduct({ name, description, price, category }) {
        // Check if category is valid
        const isCategoryValid = this.checkCategory(category);
        if (!isCategoryValid) {
            return;
        }

        // Get all categories separated by comma
        const categories = category.split(',').map(c => c.trim());

        this.productService.updateProduct({
            id: this.editProduct.id,
            name,
            description,
            price,
            category: categories
        }).subscribe(() => this.formAddProduct.reset());
        this.closeModal();
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
