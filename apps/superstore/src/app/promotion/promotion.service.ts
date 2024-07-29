import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, tap } from "rxjs";
import { NotificationsService } from "../shared/notifications/notifications.service";
import { PromotionDto } from '@superstore/interfaces';

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    promotionCodeUrl = environment.promotionCodeUrl();

    constructor(
        private http: HttpClient,
        private readonly notificationService: NotificationsService,
    ) {
    }

    addPromotion(promotion: PromotionDto) {
        return this.http.post(`${ this.promotionCodeUrl }`, promotion)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Promotion code added successfully');
                }),
                catchError(err => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    getAllPromotions() {
        return this.http.get<PromotionDto[]>(this.promotionCodeUrl);
    }

    checkPromotionCode(code: string) {
        return this.http.get(`${ this.promotionCodeUrl }/${ code }`)
            .pipe(
                tap((promotion: PromotionDto) => {
                    return this.usePromotionCode(promotion).subscribe();
                })
            )
    }

    usePromotionCode(promotion: PromotionDto) {
        return this.http.put(`${ this.promotionCodeUrl }/use-promotion/${ promotion.label }`, promotion);
    }

    updatePromotion(promotion: PromotionDto) {
        return this.http.put(`${ this.promotionCodeUrl }/${ promotion.id }`, promotion)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Promotion code updated successfully');
                }),
                catchError(err => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    deletePromotion(promotion: PromotionDto) {
        return this.http.delete(`${ this.promotionCodeUrl }/${ promotion.id }`)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Promotion code deleted successfully');
                }),
                catchError(err => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }
}
