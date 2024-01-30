import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  items,
  itemPrices,
  itemSizes,
  Item,
  Price,
  Size,
  StoredPrices,
} from './data/data';
import { UndoService } from './services/undo.service';
import { StorageService } from './services/storage.service';

interface DisplayItem {
  item: Item;
  prices: { size: Size; price: Price }[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  displayItems: DisplayItem[] = [];
  selectedSizes: { [key: string]: boolean } = {};
  isAccordionOpen: { [key: number]: boolean } = {};
  isChanged: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private undoService: UndoService,
    private storageService: StorageService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeDisplayItems();
      this.initializeSelectedSizes();
    }
  }

  ngOnInit() {
    this.displayItems.forEach((displayItem) => {
      displayItem.prices.forEach((priceInfo) => {
        this.undoService.setInitialPrice(
          displayItem.item.itemId,
          priceInfo.size.sizeId,
          priceInfo.price.price
        );
      });
    });
  }

  initializeDisplayItems() {
    if (isPlatformBrowser(this.platformId)) {
      const storedPrices: StoredPrices =
        this.storageService.get('prices') || {};
      this.displayItems = items.map((item) => {
        const prices = itemPrices
          .filter((price) => price.itemId === item.itemId)
          .map((price) => {
            const size = itemSizes.find((size) => size.sizeId === price.sizeId);
            const priceKey = `${item.itemId}_${size?.sizeId}`;
            const storedPrice = storedPrices[priceKey];
            return {
              size: size,
              price:
                storedPrice !== undefined
                  ? { ...price, price: storedPrice }
                  : price,
            };
          })
          .filter((priceSizePair) => priceSizePair.size !== undefined) as {
          size: Size;
          price: Price;
        }[];

        return { item, prices };
      });
    }
  }

  initializeSelectedSizes() {
    for (const displayItem of this.displayItems) {
      for (const priceInfo of displayItem.prices) {
        const key = `${displayItem.item.itemId}_${priceInfo.size.sizeId}`;
        this.selectedSizes[key] = true;
      }
    }
  }

  updatePrice(itemId: number, sizeId: number, newPrice: number) {
    const storedPrices: StoredPrices = this.storageService.get('prices') || {};
    storedPrices[`${itemId}_${sizeId}`] = newPrice;
    this.isChanged = true;
    this.storageService.set('prices', storedPrices);

    this.displayItems = this.displayItems.map((displayItem) => {
      if (displayItem.item.itemId === itemId) {
        return {
          ...displayItem,
          prices: displayItem.prices.map((priceInfo) => {
            if (priceInfo.size.sizeId === sizeId) {
              return {
                ...priceInfo,
                price: { ...priceInfo.price, price: newPrice },
              };
            }
            return priceInfo;
          }),
        };
      }
      return displayItem;
    });
  }

  onCheckboxChange(event: Event, itemId: number, sizeId: number) {
    const input = event.target as HTMLInputElement;
    this.onSizeSelect(itemId, sizeId, input.checked);
  }

  onSizeSelect(itemId: number, sizeId: number, isChecked: boolean) {
    const key = `${itemId}_${sizeId}`;
    this.selectedSizes[key] = isChecked;

    if (!isChecked) {
      this.updatePrice(itemId, sizeId, 0);
    }
  }

  getPrice(itemId: number, sizeId: number, defaultPrice: number): number {
    const key = `${itemId}_${sizeId}`;
    return this.selectedSizes[key] ? defaultPrice : 0.0;
  }

  toggleAccordion(itemId: number) {
    this.isAccordionOpen[itemId] = !this.isAccordionOpen[itemId];
  }

  isStateChanged(displayItem: DisplayItem): boolean {
    return displayItem.prices.some((priceInfo) => {
      const originalPrice = this.undoService.getOriginalPrice(
        displayItem.item.itemId,
        priceInfo.size.sizeId
      );
      return priceInfo.price.price !== originalPrice;
    });
  }

  resetAllPrices(): void {
    this.displayItems = this.displayItems.map((displayItem) => ({
      ...displayItem,
      prices: displayItem.prices.map((priceInfo) => {
        const originalPrice = this.undoService.getOriginalPrice(
          displayItem.item.itemId,
          priceInfo.size.sizeId
        );
        this.isChanged = false;
        return {
          ...priceInfo,
          price: { ...priceInfo.price, price: originalPrice },
        };
      }),
    }));

    this.updateLocalStorageWithOriginalPrices();
  }

  updateLocalStorageWithOriginalPrices(): void {
    const storedPrices: StoredPrices = {};
    this.displayItems.forEach((displayItem) => {
      displayItem.prices.forEach((priceInfo) => {
        const key = `${displayItem.item.itemId}_${priceInfo.size.sizeId}`;
        storedPrices[key] = priceInfo.price.price;
      });
    });
    this.storageService.set('prices', storedPrices);
  }
}
