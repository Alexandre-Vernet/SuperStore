import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../product/product.service';
import { ProductDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

    @Input() editProduct: ProductDto | null;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    formAddProduct = new FormGroup({
        name: new FormControl('=', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        price: new FormControl(0, [Validators.required, Validators.min(0)]),
        categories: new FormControl('', [Validators.required]),
        images: new FormControl('', Validators.required)
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
                categories: this.editProduct.categories.join(', '),
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

        const product: Omit<ProductDto, 'id'> = {
            name,
            slug: name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-'), /*Remove all special characters and replace spaces with dash*/
            description,
            price,
            categories: categories.split(',').map(c => c.trim()),
            images: images.split(',').map(c => c.trim())
        };


        // Check if categories is valid
        const isCategoryValid = this.checkCategories(categories);
        if (!isCategoryValid) {
            return;
        }

        if (this.editProduct?.id) {
            this.updateProduct({
                ...product,
                id: this.editProduct.id
            });
        } else {
            this.addProduct(product);
        }
    }

    addProduct(product: Omit<ProductDto, 'id'>) {
        this.productService.addProduct(product).subscribe(() => this.resetForm());
    }

    updateProduct(product: ProductDto) {
        this.productService.updateProduct(product).subscribe(() => this.resetForm());
    }

    private resetForm() {
        this.formAddProduct.reset();
        this.closeModalAddProduct();
    }

    private checkCategories(category: string): boolean {
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
