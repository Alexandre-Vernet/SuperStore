import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

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
        return this.http.get(`${ this.promotionCodeUrl }/${ code }`);
    }
}
