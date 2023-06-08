import { Component, OnInit } from '@angular/core';
import { LoaderService } from "./loader.service";

@Component({
    selector: 'superstore-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {

    isLoading = false;

    constructor(
        private readonly loaderService: LoaderService
    ) {
    }

    ngOnInit(): void {
        this.loaderService.isLoading
            .subscribe(isLoading => {
                this.isLoading = isLoading;
            });
    }
}
