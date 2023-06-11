import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { ReviewStarsComponent } from './review-stars/review-stars.component';
import { ReviewStatsComponent } from './review-stats/review-stats.component';
import { ReviewDescriptionComponent } from './review-description/review-description.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        ReviewComponent,
        ReviewStarsComponent,
        ReviewStatsComponent,
        ReviewDescriptionComponent,
        AddReviewComponent,
    ],
  imports: [CommonModule, ReactiveFormsModule],
    exports: [ReviewComponent, ReviewStarsComponent, AddReviewComponent],
})
export class ReviewModule {
}
