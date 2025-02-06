import { Component, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';

@Component({
    selector: 'superstore-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    @Input() currentPage = new BehaviorSubject<number>(0);
    @Input() totalPages = new BehaviorSubject<number>(0);
    totalPagesArray: (number | string)[] = [];

    @Output() pageChange = new Subject<number>();

    ngOnInit() {
        combineLatest([this.currentPage, this.totalPages]).subscribe(([currentPage, totalPages]) => {
            this.totalPagesArray = this.generatePagination(currentPage, totalPages);
        });
    }

    previousPage() {
        if (this.currentPage.value > 1) {
            this.getPage(this.currentPage.value - 1);
        }
    }

    nextPage() {
        if (this.currentPage.value < this.totalPages.value) {
            this.getPage(this.currentPage.value + 1);
        }
    }

    getPage(page: number | string) {
        if (typeof page === 'string') {
            page = Number(page);
        }
        this.currentPage.next(page);
        this.pageChange.next(this.currentPage.value);
    }

    private generatePagination(currentPage: number, totalPages: number): (number | string)[] {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [1];

        if (currentPage > 3) {
            pages.push('...');
        }

        for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        pages.push(totalPages);
        return pages;
    }
}


