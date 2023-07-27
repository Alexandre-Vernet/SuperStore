import { Component, OnInit } from '@angular/core';
import { PromotionDto } from "@superstore/interfaces";
import { PromotionService } from "../../../promotion/promotion.service";

@Component({
    selector: 'superstore-list-promotions',
    templateUrl: './list-promotions.component.html',
    styleUrls: ['./list-promotions.component.scss'],
})
export class ListPromotionsComponent implements OnInit {
    promotions: PromotionDto[] = [];
    editedPromotion: PromotionDto;
    showModalEditPromotion = false;

    constructor(
        private readonly promotionService: PromotionService
    ) {
    }

    ngOnInit() {
        this.getAllPromotionCode();
    }

    getAllPromotionCode() {
        this.promotionService.getAllPromotions()
            .subscribe((promotion) => {
                this.promotions = promotion;
            });
    }

    public openModalEditPromotion(): void {
        this.showModalEditPromotion = true;
    }

    public closeModalEditPromotion(): void {
        this.showModalEditPromotion = false;
        this.editedPromotion = null;
        this.getAllPromotionCode();
    }

    editPromotion(promotion: PromotionDto) {
        this.editedPromotion = promotion;
        this.openModalEditPromotion();
    }

    deletePromotion(promotion: PromotionDto) {
        this.promotionService.deletePromotion(promotion)
            .subscribe(() => {
                this.promotions = this.promotions.filter((p) => p.id !== promotion.id);
            });
    }
}
