import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    searchBar = new BehaviorSubject('');
}
