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
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
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
