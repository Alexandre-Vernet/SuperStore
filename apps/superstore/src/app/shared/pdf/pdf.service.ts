import { Injectable } from '@angular/core';
import { OrderDto } from '@superstore/interfaces';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor(
        private datePipe: DatePipe
    ) {
    }

    downloadInvoice(order: OrderDto) {
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

        // Billing Address
        doc.setFontSize(18);
        doc.text('Billing Address', 50, 170);
        doc.setFontSize(14);
        doc.text(order.address.country, 50, 190);
        doc.text(`${ order.address.address } \n${ order.address.apartment }`, 50, 210);
        doc.text(order.address.zipCode, 50, 250);
        doc.text(order.address.phone, 50, 270);


        const productRows = [];

        order.products.forEach((p) => {
            const productName = p.product.name;
            const productPrice = p.product.price;
            const productCategories = p.product.categories;
            const productDescription = p.product.description;

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
