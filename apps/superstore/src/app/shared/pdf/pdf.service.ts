import { Injectable } from '@angular/core';
import { OrderDto, OrderWithProductsDto } from "@superstore/interfaces";
import { jsPDF } from "jspdf";
import { forkJoin } from "rxjs";
import autoTable from "jspdf-autotable";
import { ProductService } from "../../product/product.service";
import { UserService } from "../../user/user.service";
import { DatePipe } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor(
        private readonly productService: ProductService,
        private readonly userService: UserService,
        private datePipe: DatePipe
    ) {
    }

    downloadInvoice(order: OrderWithProductsDto) {
        const doc = new jsPDF('p', 'pt');
        doc.setFont('helvetica');

        // Header
        doc.setFontSize(50);
        doc.text('SuperStore', 50, 50);
        doc.addImage('assets/icon.png', 'PNG', 450, 20, 100, 100)


        // Order number
        doc.setFontSize(18);
        doc.text('Order number', 50, 100);
        doc.setFontSize(14);
        doc.text(`# ${ order.id }`, 50, 120);

        // Date
        doc.setFontSize(18);
        doc.text('Date', 200, 100);
        doc.setFontSize(14);
        doc.text(`${ this.datePipe.transform(order.createdAt, 'dd/MM/yyyy') }`, 200, 120);

        this.userService.getAddress(order.addressId)
            .subscribe((address) => {
                // Billing Address
                doc.setFontSize(18);
                doc.text('Billing Address', 50, 170);
                doc.setFontSize(14);
                doc.text(address.country, 50, 190);
                doc.text(`${ address.address } \n${ address.apartment }`, 50, 210);
                doc.text(address.postalCode, 50, 250);
                doc.text(address.phone, 50, 270);


                const productObservables = order.products.map((product) => {
                    return this.productService.getProductFromId(product.id);
                });

                forkJoin(productObservables)
                    .subscribe((products) => {
                        const productRows = [];

                        products.forEach((p) => {
                            const productName = p.name;
                            const productPrice = p.price;
                            const productCategories = p.category;
                            const productDescription = p.description;

                            productRows.push([
                                productName,
                                `${ productPrice } €`,
                                productCategories,
                                productDescription,
                            ]);
                        });

                        const header = ['Product', 'Price', 'Categories', 'Description'];
                        autoTable(doc, {
                            head: [header],
                            body: productRows,
                            startY: 300,
                            didParseCell: function (table) {
                                table.column.minWidth = 5;
                            },
                        });

                        const productTableHeight = productRows.length * 100;
                        if (productTableHeight > 500) {
                            doc.addPage();
                            this.displayPriceOnBottomPage(doc, 50, order);
                        } else {
                            this.displayPriceOnBottomPage(doc, productTableHeight + 300, order);
                        }

                        doc.save(`invoice-${ new Date().getTime() }.pdf`);
                    });
            });
    }

    displayPriceOnBottomPage(doc, priceY: number, order: OrderDto) {
        // Price
        doc.setFontSize(16);
        doc.text('Subtotal', 400, priceY);
        doc.setFontSize(14);
        doc.text(`${ order.subTotalPrice } €`, 500, priceY);

        const shippingY = priceY + 25;
        doc.setFontSize(16);
        doc.text('Shipping', 400, shippingY);
        doc.setFontSize(14);
        doc.text(`${ order.shippingPrice } €`, 500, shippingY);

        const taxesY = shippingY + 25;
        doc.setFontSize(16);
        doc.text('Taxes', 400, taxesY);
        doc.setFontSize(14);
        doc.text(`${ order.taxesPrice } €`, 500, taxesY);

        const totalY = taxesY + 35;
        doc.setFontSize(25);
        doc.text('Total', 400, totalY);
        doc.text(`${ order.totalPrice } €`, 500, totalY);
    }
}
