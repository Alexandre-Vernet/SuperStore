import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'productProduct',
})
export class ProductProductPipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown {
        return null;
    }

  convertProductNameToSlug(name: string): string {
    return name.toLowerCase().replace(/ /g, '-');
  }
}
