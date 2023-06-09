import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    isLoading = new BehaviorSubject(false);

    setLoading(isLoading: boolean) {
        this.isLoading.next(isLoading)
    }
}
