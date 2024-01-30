export interface Item {
  itemId: number;
  name: string;
}

export interface Size {
  sizeId: number;
  name: string;
}

export interface Price {
  itemId: number;
  sizeId: number;
  price: number;
}

export interface StoredPrices {
  [key: string]: number;
}


export let items: Item[] = [
  {
    itemId: 0,
    name: 'Margherita',
  },
  {
    itemId: 1,
    name: 'Pepperoni',
  },
  {
    itemId: 2,
    name: 'Hawaiian',
  },
  {
    itemId: 3,
    name: 'Veggie',
  },
  {
    itemId: 4,
    name: 'Meat Lovers',
  },
];

export let itemPrices: Price[] = [
  {
    itemId: 0,
    sizeId: 0,
    price: 3.99,
  },
  {
    itemId: 0,
    sizeId: 1,
    price: 5.99,
  },
  {
    itemId: 0,
    sizeId: 2,
    price: 7.99,
  },
  {
    itemId: 1,
    sizeId: 0,
    price: 4.42,
  },
  {
    itemId: 1,
    sizeId: 1,
    price: 6.52,
  },
  {
    itemId: 1,
    sizeId: 2,
    price: 8.62,
  },
  {
    itemId: 2,
    sizeId: 0,
    price: 5.5,
  },
  {
    itemId: 2,
    sizeId: 1,
    price: 7.2,
  },
  {
    itemId: 2,
    sizeId: 2,
    price: 9.3,
  },
  {
    itemId: 3,
    sizeId: 0,
    price: 4.8,
  },
  {
    itemId: 3,
    sizeId: 1,
    price: 6.9,
  },
  {
    itemId: 3,
    sizeId: 2,
    price: 8.5,
  },
  {
    itemId: 4,
    sizeId: 0,
    price: 6.0,
  },
  {
    itemId: 4,
    sizeId: 1,
    price: 8.0,
  },
  {
    itemId: 4,
    sizeId: 2,
    price: 10.0,
  },
];

export let itemSizes: Size[] = [
  {
    sizeId: 0,
    name: 'Small',
  },
  {
    sizeId: 1,
    name: 'Medium',
  },
  {
    sizeId: 2,
    name: 'Large',
  },
];
