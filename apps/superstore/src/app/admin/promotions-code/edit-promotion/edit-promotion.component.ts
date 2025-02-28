import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PromotionDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PromotionService } from '../../../promotion/promotion.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-edit-promotion',
    templateUrl: './edit-promotion.component.html',
    styleUrls: ['./edit-promotion.component.scss']
})
export class EditPromotionComponent implements OnInit, OnDestroy {

    @Input() editPromotion: PromotionDto;

    formUpdatePromotion = new FormGroup({
        label: new FormControl('', [Validators.required]),
        amount: new FormControl(0, [Validators.required, Validators.min(5)]),
        count: new FormControl(0, [Validators.required, Validators.min(0)])
    });


    @Output() updatedPromotion$: Subject<PromotionDto> = new Subject<PromotionDto>;
    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly promotionService: PromotionService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        if (this.editPromotion) {
            this.formUpdatePromotion.patchValue({
                amount: this.editPromotion.amount,
                count: this.editPromotion.count,
                label: this.editPromotion.label
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    closeModalEditPromotion() {
        this.updatedPromotion$.next(null);
    }

    submitForm() {
        if (this.formUpdatePromotion.valid) {
            if (this.editPromotion) {
                this.updatePromotion();
            } else {
                this.addPromotion();
            }
        }
    }

    addPromotion() {
        const promotion: PromotionDto = {
            label: this.formUpdatePromotion.value.label,
            amount: this.formUpdatePromotion.value.amount,
            count: this.formUpdatePromotion.value.count
        };

        this.promotionService.addPromotion(promotion)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                {
                    next: () => {
                        this.notificationService.showSuccessNotification('Success', 'Promotion code added successfully');
                        this.updatedPromotion$.next(promotion);
                    },
                    error: (err) => {
                        this.formUpdatePromotion.setErrors({
                            [err.error.field ? err.error.field : 'label']: err.error.field,
                            error: err.error.message
                        });
                    }
                });
    }

    updatePromotion() {
        const promotion: PromotionDto = {
            id: this.editPromotion.id,
            label: this.formUpdatePromotion.value.label,
            amount: this.formUpdatePromotion.value.amount,
            count: this.formUpdatePromotion.value.count
        };

        this.promotionService.updatePromotion(promotion)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.notificationService.showSuccessNotification('Success', 'Promotion code updated successfully');
                    this.formUpdatePromotion.reset();
                    this.updatedPromotion$.next(promotion);
                },
                error: (err) => {
                    this.formUpdatePromotion.setErrors({
                        [err.error.field ? err.error.field : 'label']: err.error.field,
                        error: err.error.message
                    });
                }
            });
    }

    @HostListener('document:keydown.escape', ['$event'])
    onKeydownEscapeHandler() {
        this.closeModalEditPromotion();
    }

    @HostListener('document:keydown.control.enter', ['$event'])
    onKeydownControlEnterHandler() {
        this.submitForm();
    }
}
