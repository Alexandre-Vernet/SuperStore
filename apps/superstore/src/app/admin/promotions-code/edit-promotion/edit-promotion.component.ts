import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PromotionDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PromotionService } from '../../../promotion/promotion.service';

@Component({
    selector: 'superstore-edit-promotion',
    templateUrl: './edit-promotion.component.html',
    styleUrls: ['./edit-promotion.component.scss']
})
export class EditPromotionComponent implements OnInit {

    @Input() editPromotion: PromotionDto;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    formUpdatePromotion = new FormGroup({
        label: new FormControl('', [Validators.required]),
        amount: new FormControl(0, [Validators.required, Validators.min(5)]),
        count: new FormControl(0, [Validators.required, Validators.min(0)])
    });

    constructor(
        private readonly promotionService: PromotionService
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

    closeModalEditPromotion() {
        this.closeModal.emit();
    }

    submit() {
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
            .subscribe(
                {
                    next: () => this.closeModalEditPromotion(),
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
            .subscribe({
                next: () => this.closeModalEditPromotion(),
                error: (err) => {
                    console.log(err);
                    this.formUpdatePromotion.setErrors({
                        [err.error.field ? err.error.field : 'label']: err.error.field,
                        error: err.error.message
                    })
                }
            });
    }
}
