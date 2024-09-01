import { Injectable } from '@angular/core';
import { OrderDto } from '@superstore/interfaces';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { CustomCurrencyPipe } from '../currency/currency.pipe';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor(
        private readonly datePipe: DatePipe,
        private readonly currencyPipe: CustomCurrencyPipe
    ) {
    }

    downloadInvoice(order: OrderDto, download = true): Observable<string> {
        const doc = new jsPDF('p', 'pt');
        doc.setFont('helvetica');

        // Header
        doc.setFontSize(45);
        doc.text('SuperStore', 50, 50);
        doc.addImage('assets/icon.png', 'PNG', 450, 20, 100, 100);


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

        // Billing Address
        doc.setFontSize(18);
        doc.text('Billing Address', 50, 170);
        doc.setFontSize(14);
        doc.text(order.address.country, 50, 190);
        order.address.company ? doc.text(order.address.company, 50, 210) : null;
        doc.text(`${ order.address.address } \n${ order.address.apartment }`, 50, 230);
        doc.text(order.address.zipCode, 50, 270);
        doc.text(order.address.phone, 50, 290);


        const productRows = [];

        order.products.forEach((orderProduct) => {
            const product = orderProduct.product.name;
            const quantity = orderProduct.quantity;
            const productPrice = this.currencyPipe.transform(orderProduct.product.price);

            productRows.push([
                product,
                quantity,
                productPrice,
            ]);
        });


        const header = ['Product', 'Quantity', 'Price'];
        autoTable(doc, {
            head: [header],
            body: productRows,
            startY: 300,
            didParseCell: function (table) {
                table.column.minWidth = 5;
            },
        });

        const productTableHeight = productRows.length * 100;
        if (productTableHeight > 450) {
            doc.addPage();
            this.displayPriceOnBottomPage(doc, 50, order);
        } else {
            this.displayPriceOnBottomPage(doc, productTableHeight + 300, order);
        }

        if (download) {
            doc.save(`invoice-${ new Date().getTime() }.pdf`);
        }

        return of(doc.output('datauristring'));
    }

    displayPriceOnBottomPage(doc, priceY: number, order: OrderDto) {
        // Price
        doc.setFontSize(16);
        doc.text('Subtotal', 350, priceY);
        doc.setFontSize(14);
        doc.text(`${ order.subTotalPrice } €`, 450, priceY);

        const shippingY = priceY + 25;
        doc.setFontSize(16);
        doc.text('Shipping', 350, shippingY);
        doc.setFontSize(14);
        doc.text(`${ order.shippingPrice } €`, 450, shippingY);

        const taxesY = shippingY + 25;
        doc.setFontSize(16);
        doc.text('Taxes', 350, taxesY);
        doc.setFontSize(14);
        doc.text(`${ order.taxesPrice } €`, 450, taxesY);

        const totalY = taxesY + 35;
        doc.setFontSize(25);
        doc.text('Total', 350, totalY);
        doc.text(`${ order.totalPrice } €`, 450, totalY);
    }
}
