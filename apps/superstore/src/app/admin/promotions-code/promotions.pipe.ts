import { Pipe, PipeTransform } from '@angular/core';
import { PromotionDto } from "@superstore/interfaces";

@Pipe({
    name: 'searchPromotions'
})
export class PromotionsPipe implements PipeTransform {
    transform(search: string, promotions: PromotionDto[]): PromotionDto[] {
        return promotions?.filter(product => {
            return product.label.toLowerCase().includes(search.toLowerCase());
        });
    }
}
