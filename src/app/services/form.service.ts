import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getDropdownMonths(): Observable<number[]> {
    const months = Array.from(new Array(12), (_, i) => i + 1);
    return of(months);
  }

  getDropdownYears(): Observable<number[]> {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(10), (_, i) => i + currentYear);
    return of(years);
  }
}
