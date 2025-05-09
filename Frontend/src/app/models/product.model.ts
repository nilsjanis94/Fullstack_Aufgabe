export interface Stock {
  quantity: number;
}

export interface Product {
  id?: number;
  name: string;
  short_description: string;
  product_description: string;
  stock: Stock;
  price: number;
}
