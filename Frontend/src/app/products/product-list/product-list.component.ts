import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Produktliste</h2>
      <button class="btn-create" [routerLink]="['/products/create']">Neues Produkt</button>
      
      <div *ngIf="loading">Produkte werden geladen...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div class="product-grid" *ngIf="products.length > 0">
        <div class="product-card" *ngFor="let product of products">
          <h3>{{ product.name }}</h3>
          <p>{{ product.short_description }}</p>
          <p class="price">{{ product.price }} €</p>
          <p>Lagerbestand: {{ product.stock.quantity }}</p>
          <div class="actions">
            <button [routerLink]="['/products', product.id]">Details</button>
            <button [routerLink]="['/products/edit', product.id]">Bearbeiten</button>
            <button (click)="deleteProduct(product.id)">Löschen</button>
          </div>
        </div>
      </div>
      
      <div *ngIf="products.length === 0 && !loading">Keine Produkte vorhanden.</div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .product-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    .price { font-weight: bold; color: #e63946; }
    .actions { display: flex; gap: 10px; margin-top: 15px; }
    .actions button { padding: 5px 10px; cursor: pointer; }
    .btn-create { padding: 10px 15px; background: #2a9d8f; color: white; border: none; 
                 border-radius: 5px; margin-bottom: 20px; cursor: pointer; }
    .error { color: red; margin: 20px 0; }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const productsSub = this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden der Produkte: ' + err.message;
        this.loading = false;
      }
    });
    this.subscriptions.add(productsSub);
  }

  deleteProduct(id?: number): void {
    if (!id) return;
    
    if (confirm('Möchtest du dieses Produkt wirklich löschen?')) {
      const deleteSub = this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          this.error = 'Fehler beim Löschen: ' + err.message;
        }
      });
      this.subscriptions.add(deleteSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
