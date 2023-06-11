import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from "./review.component";
import { ReviewStarsComponent } from "./review-stars/review-stars.component";

@NgModule({
    declarations: [ReviewComponent, ReviewStarsComponent],
    imports: [CommonModule],
    exports: [ReviewComponent, ReviewStarsComponent],
})
export class ReviewModule {
}
