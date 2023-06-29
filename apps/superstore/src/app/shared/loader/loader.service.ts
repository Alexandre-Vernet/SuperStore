import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    isLoading = new BehaviorSubject(false);

    setLoading(isLoading: boolean) {
        this.isLoading.next(isLoading);

        if (isLoading) {
            document.querySelector('body').classList.add('hide-scroller');
        } else {
            document.querySelector('body').classList.remove('hide-scroller');
        }
    }
}
