import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './review.component';
import { ReviewStarsComponent } from './review-stars/review-stars.component';
import { ReviewStatsComponent } from './review-stats/review-stats.component';
import { ReviewDescriptionComponent } from './review-description/review-description.component';

@NgModule({
    declarations: [
        ReviewComponent,
        ReviewStarsComponent,
        ReviewStatsComponent,
        ReviewDescriptionComponent,
    ],
    imports: [CommonModule],
    exports: [ReviewComponent, ReviewStarsComponent],
})
export class ReviewModule {
}
