import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../product/product.service';
import { ProductDto } from '@superstore/interfaces';
import { categoriesAllowed } from '@superstore/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, OnDestroy {

    protected readonly categoriesAllowed = categoriesAllowed;
    @Input() editProduct: ProductDto | null;
    @Output() updateProduct$: Subject<ProductDto> = new EventEmitter<ProductDto>();

    formAddProduct = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        price: new FormControl(0, [Validators.required, Validators.min(1)]),
        category: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        images: new FormControl('', [Validators.required, Validators.maxLength(2000)])
    });

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        if (this.editProduct?.id) {
            this.formAddProduct.setValue({
                name: this.editProduct.name,
                description: this.editProduct.description,
                price: Math.round(this.editProduct.price * 100) / 100,
                category: this.editProduct.category,
                images: this.editProduct.images.map(i => i.url).join(', ')
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    closeModalAddProduct() {
        this.updateProduct$.next(null);
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
        this.productService.addProduct(product)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
            next: () => {
                this.notificationService.showSuccessNotification('Success', 'Product added successfully');
                this.resetForm();
                this.updateProduct$.next(product);
            },
            error: (err) => this.formAddProduct.setErrors({
                [err.error.field ? err.error.field : 'name']: err.error.field,
                error: err.error.message
            })
        });
    }

    updateProduct(product: ProductDto) {
        this.productService.updateProduct(product)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
            next: () => {
                this.notificationService.showSuccessNotification('Success', 'Product updated successfully');
                this.resetForm();
                this.updateProduct$.next(product);
            },
            error: (err) => this.formAddProduct.setErrors({
                [err.error.field ? err.error.field : 'name']: err.error.field,
                error: err.error.message
            })
        });
    }

    private resetForm() {
        this.formAddProduct.reset();
    }

    @HostListener('document:keydown.escape', ['$event'])
    onKeydownEscapeHandler() {
        this.closeModalAddProduct();
    }

    @HostListener('document:keydown.control.enter', ['$event'])
    onKeydownControlEnterHandler() {
       this.submitForm();
    }
}
