import { Pipe, PipeTransform } from '@angular/core';
import { ProductDto } from "@superstore/libs";

@Pipe({
    name: 'search',
})
export class ProductPipe implements PipeTransform {
    transform(search: string, products: ProductDto[]): ProductDto[] {
        return products.filter(product => {
            return product.name?.toLowerCase().includes(search.toLowerCase());
        });
    }

    convertProductNameToSlug(name: string): string {
        return name?.toLowerCase().replace(/ /g, '-');
    }
}
