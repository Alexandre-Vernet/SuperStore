import { Component, OnDestroy, OnInit } from '@angular/core';
import { PromotionDto } from '@superstore/interfaces';
import { PromotionService } from '../../../promotion/promotion.service';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { AdminSearchBarComponent } from '../../search-bar/admin-search-bar/admin-search-bar.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

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
        private readonly promotionService: PromotionService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.promotionService.getAllPromotions(),
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

    updatePromotion(updatePromotion: PromotionDto) {
        this.showModalEditPromotion = false;

        if (updatePromotion) {
            const index = this.promotions.findIndex(o => o.id === updatePromotion.id);
            this.promotions[index] = updatePromotion;
            this.filteredPromotions = [...this.promotions];
        }
    }

    editPromotion(promotion: PromotionDto) {
        this.editedPromotion = promotion;
        this.openModalAddPromotion();
    }

    deletePromotion(promotion: PromotionDto) {
        this.promotionService.deletePromotion(promotion)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.notificationService.showSuccessNotification('Success', 'Promotion code deleted successfully');
                    this.promotions = this.promotions.filter((p) => p.id !== promotion.id);
                    this.filteredPromotions = [...this.promotions];
                }
            });
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
