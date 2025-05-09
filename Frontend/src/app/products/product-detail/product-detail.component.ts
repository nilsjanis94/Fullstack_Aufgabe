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
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
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
