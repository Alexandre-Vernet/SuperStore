import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { ProductService } from '../../product/product.service';
import { Router } from '@angular/router';

@Component({
    selector: 'superstore-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    currentYear = new Date().getFullYear();
    formEmailNewsletter = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });
    productCategories: string[] = [];
    MAX_CATEGORIES = 10;

    constructor(
        private readonly newsletterService: NewsletterService,
        private readonly productService: ProductService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.productService.products$
            .subscribe(products => {
                products.map(product => {
                    product?.categories?.forEach((category) => {
                        if (!this.productCategories.includes(category) && this.productCategories.length < this.MAX_CATEGORIES) {
                            this.productCategories.push(category);
                        }
                    });
                });
            });
    }

    filterProductsByCategory(category: string) {
        this.router.navigate(['/'], { queryParams: { category } });
    }

    submitEmailNewsletter() {
        if (this.formEmailNewsletter.valid) {
            const email = this.formEmailNewsletter.value.email;
            this.newsletterService.subscribeUserToNewsletter(email)
                .subscribe({
                    next: () => this.formEmailNewsletter.reset(),
                    error: (err) => this.formEmailNewsletter.setErrors({ error: err.error.message })
                });
        }
    }
}
