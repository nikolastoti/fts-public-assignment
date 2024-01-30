import { Injectable } from '@angular/core';
import { itemPrices } from '../data/data';

@Injectable({
  providedIn: 'root',
})
export class UndoService {
  private originalPrices: { [key: string]: number } = {};

  constructor() {
    itemPrices.forEach((price) => {
      const key = `${price.itemId}_${price.sizeId}`;
      this.originalPrices[key] = price.price;
    });
  }

  setInitialPrice(itemId: number, sizeId: number, price: number) {
    const key = `${itemId}_${sizeId}`;
    this.originalPrices[key] = price;
  }

  getOriginalPrice(itemId: number, sizeId: number): number {
    const key = `${itemId}_${sizeId}`;
    return this.originalPrices[key] || 0;
  }
}
