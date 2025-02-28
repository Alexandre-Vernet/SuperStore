import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { PromotionDto } from '@superstore/interfaces';
import { ErrorService } from '../error/error.service';

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    promotionCodeUrl = environment.promotionCodeUrl();

    constructor(
        private http: HttpClient,
        private readonly errorService: ErrorService
    ) {
    }

    getAllPromotions() {
        return this.http.get<PromotionDto[]>(this.promotionCodeUrl);
    }

    addPromotion(promotion: PromotionDto) {
        return this.http.post(`${ this.promotionCodeUrl }`, promotion);
    }

    checkPromotionCode(code: string): Observable<PromotionDto> {
        return this.http.get<PromotionDto>(`${ this.promotionCodeUrl }/${ code }`);
    }

    usePromotionCode(promotion: PromotionDto): Observable<PromotionDto> {
        return this.http.put<PromotionDto>(`${ this.promotionCodeUrl }/use-promotion/${ promotion.label }`, promotion);
    }

    updatePromotion(promotion: PromotionDto) {
        return this.http.put<PromotionDto>(`${ this.promotionCodeUrl }/${ promotion.id }`, promotion);
    }

    deletePromotion(promotion: PromotionDto) {
        return this.http.delete(`${ this.promotionCodeUrl }/${ promotion.id }`)
            .pipe(
                catchError((err) => {
                        this.errorService.setError(err.error.message);
                        return of(null);
                    }
                )
            );
    }
}
