import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../product/product.service';
import { ProductDto } from '@superstore/interfaces';
import { checkCategoriesValidators } from './check-categories.validators';

@Component({
    selector: 'superstore-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

    @Input() editProduct: ProductDto | null;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    formAddProduct = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        price: new FormControl(0, [Validators.required, Validators.min(0)]),
        categories: new FormControl('', [Validators.required, checkCategoriesValidators(), Validators.maxLength(255)]),
        images: new FormControl('', [Validators.required, Validators.maxLength(255)])
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

        const product: ProductDto = {
            name: name.trim(),
            slug: '',
            description: description.trim(),
            price,
            categories: categories.split(',').map(c => c.trim()),
            images: images.split(',').map(c => c.trim())
        };

        if (this.editProduct?.id) {
            this.updateProduct({
                ...product,
                id: this.editProduct.id
            });
        } else {
            this.addProduct(product);
        }
    }

    addProduct(product: ProductDto) {
        this.productService.addProduct(product).subscribe({
            next: () => this.resetForm(),
            error: (err) => this.formAddProduct.setErrors({
                [err.error.field]: err.error.field,
                error: err.error.message
            })
        });
    }

    updateProduct(product: ProductDto) {
        this.productService.updateProduct(product).subscribe({
            next: () => this.resetForm(),
            error: (err) => this.formAddProduct.setErrors({
                [err.error.field]: err.error.field,
                error: err.error.message
            })
        });
    }

    private resetForm() {
        this.formAddProduct.reset();
        this.closeModalAddProduct();
    }

    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModalAddProduct();
    }
}
