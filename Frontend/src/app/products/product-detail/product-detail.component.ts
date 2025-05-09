import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { Product, Stock } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="product">
      <button class="back-btn" routerLink="/products">Zurück zur Liste</button>
      
      <div class="product-detail">
        <h2>{{ product.name }}</h2>
        <div class="product-meta">
          <p class="price">Preis: {{ product.price }} €</p>
          <p class="stock">Lagerbestand: {{ product.stock.quantity }} Stück</p>
        </div>
        
        <h3>Kurzbeschreibung</h3>
        <p>{{ product.short_description }}</p>
        
        <h3>Produktbeschreibung</h3>
        <p>{{ product.product_description }}</p>
        
        <div class="actions">
          <button [routerLink]="['/products/edit', product.id]">Bearbeiten</button>
          <button (click)="deleteProduct()" class="delete-btn">Löschen</button>
        </div>
      </div>
    </div>
    
    <div class="loading" *ngIf="loading">Produkt wird geladen...</div>
    <div class="error" *ngIf="error">{{ error }}</div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .product-detail { border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin-top: 20px; }
    .product-meta { display: flex; justify-content: space-between; margin: 15px 0; }
    .price { font-weight: bold; color: #e63946; }
    .stock { color: #2a9d8f; }
    .actions { margin-top: 30px; display: flex; gap: 15px; }
    .actions button { padding: 8px 15px; cursor: pointer; }
    .delete-btn { background: #e63946; color: white; border: none; }
    .back-btn { padding: 8px 15px; cursor: pointer; }
    .loading, .error { text-align: center; margin: 30px; }
    .error { color: red; }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = false;
  error = '';
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    const productSub = this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden des Produkts: ' + err.message;
        this.loading = false;
      }
    });
    this.subscriptions.add(productSub);
  }

  deleteProduct(): void {
    if (!this.product?.id) return;
    
    if (confirm('Möchtest du dieses Produkt wirklich löschen?')) {
      const deleteSub = this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          window.location.href = '/products';
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
