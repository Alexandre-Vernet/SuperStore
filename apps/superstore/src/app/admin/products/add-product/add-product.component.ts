import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductService } from "../../../product/product.service";
import { ProductDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {

    @Input() editProduct:  ProductDto | null;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    formAddProduct = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required]),
        categories: new FormControl('', [Validators.required]),
        images: new FormControl('', Validators.required),
    });

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        if (this.editProduct?.id) {
            this.formAddProduct.setValue({
                name: this.editProduct.name,
                description: this.editProduct.description,
                price: this.editProduct.price,
                categories: this.editProduct.category.join(', '),
                images: this.editProduct.images.join(', ')
            });
        }
    }

    closeModalAddProduct() {
        this.closeModal.emit();
    }

    submitForm() {
        const {
            name,
            description,
            price,
            categories,
            images
        } = this.formAddProduct.value;


        // Check if categories is valid
        const isCategoryValid = this.checkCategories(categories);
        if (!isCategoryValid) {
            return;
        }

        if (this.editProduct?.id) {
            this.updateProduct({
                name,
                description,
                price,
                categories,
                images
            });
        } else {
            this.addProduct({
                name,
                description,
                price,
                categories,
                images
            });
        }
    }

    addProduct({ name, description, price, categories, images }) {
        // Remove all spaces and trim
        const categoriesSeparatedByComma: string[] = categories.split(',').map(c => c.trim());
        const imagesSeparatedByComma: string[] = images.split(',').map(c => c.trim());

        // Slug : Remove all special characters and replace spaces with dash
        const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '-');

        this.productService.addProduct({
            name,
            slug,
            description,
            price,
            category: categoriesSeparatedByComma,
            images: imagesSeparatedByComma
        }).subscribe(() => this.formAddProduct.reset());
        this.closeModalAddProduct();
    }

    updateProduct({ name, description, price, categories, images }) {
        // Remove all spaces and trim
        const categoriesSeparatedByComma: string[] = categories.split(',').map(c => c.trim());
        const imagesSeparatedByComma: string[] = images.split(',').map(c => c.trim());

        // Slug : Remove all special characters and replace spaces with dash
        const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '-');

        this.productService.updateProduct({
            id: this.editProduct.id,
            name,
            slug,
            description,
            price,
            category: categoriesSeparatedByComma,
            images: imagesSeparatedByComma
        }).subscribe(() => this.formAddProduct.reset());
        this.closeModalAddProduct();
    }

    checkCategories(category: string): boolean {
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

    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModalAddProduct();
    }
}
