import { Component, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'superstore-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    @Input() currentPage = new BehaviorSubject<number>(0);
    @Input() totalPages = new BehaviorSubject<number>(0);
    totalPagesArray: number[] = [];

    @Output() pageChange = new Subject<number>();

    ngOnInit() {
        this.totalPages
            .subscribe(totalPages => this.totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1));
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

    getPage(page: number) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.currentPage.next(page);
        this.pageChange.next(this.currentPage.value);
    }

}


