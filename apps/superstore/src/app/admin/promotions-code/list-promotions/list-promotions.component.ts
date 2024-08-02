import { Component, OnInit } from '@angular/core';
import { PromotionDto } from "@superstore/interfaces";
import { PromotionService } from "../../../promotion/promotion.service";
import { SearchBar } from "../../search-bar/search-bar";

@Component({
    selector: 'superstore-list-promotions',
    templateUrl: './list-promotions.component.html',
    styleUrls: ['./list-promotions.component.scss'],
})
export class ListPromotionsComponent implements OnInit {
    promotions: PromotionDto[] = [];
    editedPromotion: PromotionDto;
    searchBar = '';
    showModalEditPromotion = false;

    constructor(
        private readonly promotionService: PromotionService
    ) {
    }

    ngOnInit() {
        this.promotionService.promotions$
            .subscribe((promotion) => {
                this.promotions = promotion;
            });

        SearchBar.searchBar
            .subscribe((search) => {
                this.searchBar = search;
            });
    }

    openModalEditPromotion(): void {
        this.showModalEditPromotion = true;
    }

    closeModalEditPromotion(): void {
        this.showModalEditPromotion = false;
        this.editedPromotion = null;
    }

    editPromotion(promotion: PromotionDto){
        this.editedPromotion = promotion;
        this.openModalEditPromotion();
    }

    deletePromotion(promotion: PromotionDto){
        this.promotionService.deletePromotion(promotion)
            .subscribe(() => {
                this.promotions = this.promotions.filter((p) => p.id !== promotion.id);
            });
    }
}
