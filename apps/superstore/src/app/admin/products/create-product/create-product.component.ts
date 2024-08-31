import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../product/product.service';
import { ProductDto } from '@superstore/interfaces';
import { categoriesAllowed } from '@superstore/interfaces';

@Component({
    selector: 'superstore-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

    protected readonly categoriesAllowed = categoriesAllowed;
    @Input() editProduct: ProductDto | null;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    formAddProduct = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        price: new FormControl(0, [Validators.required, Validators.min(1)]),
        category: new FormControl('', [Validators.required, Validators.maxLength(255)]),
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
                category: this.editProduct.category,
                images: this.editProduct.images.map(i => i.url).join(', ')
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
            category,
            images
        } = this.formAddProduct.value;

        if (!categoriesAllowed.map(categories => categories.toLowerCase()).includes(category.toLowerCase())) {
            this.formAddProduct.setErrors({
                category: 'Category not allowed'
            });
            return;
        }


        const product: ProductDto = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            images: images.split(',').map(url => ({ url: url.trim() })
            )
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
                [err.error.field ? err.error.field : 'name']: err.error.field,
                error: err.error.message
            })
        });
    }

    updateProduct(product: ProductDto) {
        this.productService.updateProduct(product).subscribe({
            next: () => this.resetForm(),
            error: (err) => this.formAddProduct.setErrors({
                [err.error.field ? err.error.field : 'name']: err.error.field,
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
