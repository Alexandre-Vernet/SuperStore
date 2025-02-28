import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

    private isResponsiveSubject = new BehaviorSubject<boolean>(false);
    isResponsive$ = this.isResponsiveSubject.asObservable();

  constructor() {
      fromEvent(window, 'resize')
          .pipe(
              debounceTime(200),
              startWith(null)
          )
          .subscribe(() => this.isResponsiveSubject.next(window.innerWidth < 1023));
  }
}
