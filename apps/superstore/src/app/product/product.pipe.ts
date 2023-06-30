import { Pipe, PipeTransform } from '@angular/core';
import { ProductDto } from "@superstore/interfaces";

@Pipe({
    name: 'search',
})
export class ProductPipe implements PipeTransform {
    transform(search: string, products: ProductDto[]): ProductDto[] {
        return products.filter(product => {
            return product.name?.toLowerCase().includes(search.toLowerCase());
        });
    }
}
