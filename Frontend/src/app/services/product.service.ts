import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // GET - Alle Produkte abrufen
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/`);
  }

  // GET - Ein einzelnes Produkt abrufen
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}/`);
  }

  // POST - Neues Produkt erstellen
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/create/`, product);
  }

  // PUT - Produkt vollständig aktualisieren
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/`, product);
  }

  // PATCH - Produkt teilweise aktualisieren
  patchProduct(id: number, partialProduct: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}/`, partialProduct);
  }

  // DELETE - Produkt löschen
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}/`);
  }
}
