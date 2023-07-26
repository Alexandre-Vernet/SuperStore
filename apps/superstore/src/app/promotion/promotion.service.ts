import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { tap } from "rxjs";
import { PromotionDto } from "@superstore/interfaces";

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    promotionCodeUrl = environment.promotionCodeUrl();

    constructor(
        private http: HttpClient,
    ) {
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
        return this.http.put(`${ this.promotionCodeUrl }/${ promotion.label }`, promotion);
    }
}
