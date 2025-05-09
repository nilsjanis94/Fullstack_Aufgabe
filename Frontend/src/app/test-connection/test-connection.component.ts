import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Backend-Verbindungstest</h2>
    <div *ngIf="loading">Lade Daten...</div>
    <div *ngIf="error" style="color: red">Fehler: {{error}}</div>
    <div *ngIf="products">
      <h3>Produkte vom Backend:</h3>
      <ul>
        <li *ngFor="let product of products">
          {{product.name}} - {{product.price}}€
        </li>
      </ul>
    </div>
  `,
})
export class TestConnectionComponent implements OnInit {
  products: any[] | null = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8000/api/products/').subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        console.log('Daten erfolgreich geladen:', data);
      },
      error: (err) => {
        this.error = `Verbindungsfehler: ${err.message}`;
        this.loading = false;
        console.error('Fehler beim Laden der Daten:', err);
      }
    });
  }
}
