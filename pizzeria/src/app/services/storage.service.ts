import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  get(key: string): any {
    const data = localStorage.getItem(key);
    if (data !== null) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing data from localStorage', e);
        return null;
      }
    }
    return null;
  }

  set(key: string, value: any): void {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
  }
}
