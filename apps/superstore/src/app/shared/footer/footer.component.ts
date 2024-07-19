import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { ProductService } from '../../product/product.service';
import { Router } from '@angular/router';

@Component({
    selector: 'superstore-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

    currentYear = this.getCurrentYear();
    formEmailNewsletter = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });
    productCategories: string[] = [];

    constructor(
        private readonly newsletterService: NewsletterService,
        private readonly productService: ProductService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.productService.products
            .subscribe(products => {
                products.map(product => {
                    product?.categories?.map(c => {
                        if (!this.productCategories.includes(c)) {
                            this.productCategories.push(c);
                        }
                    });
                });
            })
    }

    filterProductsByCategory(category: string) {
        this.router.navigate(['/'], { queryParams: { category } });
    }

    submitEmailNewsletter() {
        if (this.formEmailNewsletter.valid) {
            const email = this.formEmailNewsletter.value.email;
            this.newsletterService.storeEmailInDatabase(email)
                .subscribe(() => this.formEmailNewsletter.reset());
        }
    }

    getCurrentYear(): number {
        return new Date().getFullYear();
    }
}
