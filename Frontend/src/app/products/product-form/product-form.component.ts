import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <button class="back-btn" routerLink="/products">Zurück zur Liste</button>
      
      <h2>{{ isEditMode ? 'Produkt bearbeiten' : 'Neues Produkt erstellen' }}</h2>
      
      <div class="loading" *ngIf="loading">Daten werden geladen...</div>
      <div class="error" *ngIf="error">{{ error }}</div>
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" type="text" formControlName="name">
          <div class="error-msg" *ngIf="submitted && productForm.get('name')?.errors?.['required']">
            Name ist erforderlich
          </div>
        </div>
        
        <div class="form-group">
          <label for="short_description">Kurzbeschreibung</label>
          <input id="short_description" type="text" formControlName="short_description">
          <div class="error-msg" *ngIf="submitted && productForm.get('short_description')?.errors?.['required']">
            Kurzbeschreibung ist erforderlich
          </div>
        </div>
        
        <div class="form-group">
          <label for="product_description">Produktbeschreibung</label>
          <textarea id="product_description" formControlName="product_description" rows="5"></textarea>
          <div class="error-msg" *ngIf="submitted && productForm.get('product_description')?.errors?.['required']">
            Produktbeschreibung ist erforderlich
          </div>
        </div>
        
        <div class="form-group">
          <label for="quantity">Lagerbestand</label>
          <input id="quantity" type="number" formControlName="quantity" min="0">
          <div class="error-msg" *ngIf="submitted && productForm.get('quantity')?.errors?.['required']">
            Lagerbestand ist erforderlich
          </div>
        </div>
        
        <div class="form-group">
          <label for="price">Preis (€)</label>
          <input id="price" type="number" formControlName="price" step="0.01" min="0">
          <div class="error-msg" *ngIf="submitted && productForm.get('price')?.errors?.['required']">
            Preis ist erforderlich
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" routerLink="/products" class="cancel-btn">Abbrechen</button>
          <button type="submit" class="submit-btn">{{ isEditMode ? 'Aktualisieren' : 'Erstellen' }}</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    textarea { resize: vertical; }
    .error-msg { color: red; margin-top: 5px; font-size: 0.9em; }
    .form-actions { display: flex; gap: 15px; margin-top: 30px; }
    .form-actions button { padding: 10px 20px; cursor: pointer; }
    .submit-btn { background: #2a9d8f; color: white; border: none; }
    .cancel-btn { background: #e9e9e9; border: 1px solid #ddd; }
    .back-btn { padding: 8px 15px; cursor: pointer; margin-bottom: 20px; }
    .loading, .error { margin: 20px 0; }
    .error { color: red; }
  `]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  isEditMode = false;
  productId?: number;
  loading = false;
  error = '';
  submitted = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      short_description: ['', Validators.required],
      product_description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    const productSub = this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          short_description: product.short_description,
          product_description: product.product_description,
          quantity: product.stock.quantity,
          price: product.price
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Fehler beim Laden des Produkts: ' + err.message;
        this.loading = false;
      }
    });
    this.subscriptions.add(productSub);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.productForm.invalid) {
      return;
    }
    
    const formValue = this.productForm.value;
    
    const product: Product = {
      name: formValue.name,
      short_description: formValue.short_description,
      product_description: formValue.product_description,
      stock: {
        quantity: formValue.quantity
      },
      price: formValue.price
    };
    
    if (this.isEditMode && this.productId) {
      const updateSub = this.productService.updateProduct(this.productId, product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.error = 'Fehler beim Aktualisieren: ' + err.message;
        }
      });
      this.subscriptions.add(updateSub);
    } else {
      const createSub = this.productService.createProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.error = 'Fehler beim Erstellen: ' + err.message;
        }
      });
      this.subscriptions.add(createSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
