import { Component, OnDestroy, OnInit } from '@angular/core';
import { PromotionDto } from '@superstore/interfaces';
import { PromotionService } from '../../../promotion/promotion.service';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { AdminSearchBarComponent } from '../../search-bar/admin-search-bar/admin-search-bar.component';

@Component({
    selector: 'superstore-list-promotions',
    templateUrl: './list-promotions.component.html',
    styleUrls: ['./list-promotions.component.scss']
})
export class ListPromotionsComponent implements OnInit, OnDestroy {
    promotions: PromotionDto[] = [];
    filteredPromotions: PromotionDto[] = [];
    editedPromotion: PromotionDto;

    showModalEditPromotion = false;

    noResultSearch = false;

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 25,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly promotionService: PromotionService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.promotionService.promotions$,
            AdminSearchBarComponent.searchBar
        ])
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(([promotions]) => promotions.sort((a, b) => a?.id - b?.id)),
                tap(([promotions]) => this.pagination.totalPage.next(Math.ceil(promotions.length / this.pagination.itemsPerPage)))
            )
            .subscribe(([promotions, search]) => {
                this.promotions = promotions;

                if (!search) {
                    this.filteredPromotions = [...this.promotions];
                    this.noResultSearch = false;
                } else {
                    this.pagination.totalPage.next(0);

                    this.filteredPromotions = promotions.filter(promotion =>
                        promotion.amount.toString().includes(search.toLowerCase()) ||
                        promotion.label.toLowerCase().includes(search.toLowerCase())
                    );

                    this.noResultSearch = this.filteredPromotions.length === 0;
                }

                this.pagination.currentPage.next(1);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    openModalAddPromotion() {
        this.showModalEditPromotion = true;
    }

    closeModalEditPromotion() {
        this.showModalEditPromotion = false;
        this.editedPromotion = null;
    }

    editPromotion(promotion: PromotionDto) {
        this.editedPromotion = promotion;
        this.openModalAddPromotion();
    }

    deletePromotion(promotion: PromotionDto) {
        this.promotionService.deletePromotion(promotion)
            .subscribe();
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
