import { Pipe, PipeTransform } from '@angular/core';
import { ProductDto } from "@superstore/libs";

@Pipe({
    name: 'searchProducts'
})
export class ProductsPipe implements PipeTransform {
    transform(search: string, products: ProductDto[]): ProductDto[] {
        return products?.filter(product => {
            return product.id.toString().includes(search.toLowerCase()) ||
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase()) ||
                product.price.toString().includes(search.toLowerCase()) ||
                product.category.toString().includes(search.toLowerCase());

        });
    }
}
