import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <h1>Shop Frontend</h1>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>
      
      <footer>
        <p>Praxistag Backend © 2025</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container { display: flex; flex-direction: column; min-height: 100vh; }
    header { background: #1d3557; color: white; padding: 1rem; text-align: center; }
    main { flex: 1; padding: 1rem; }
    footer { background: #f1faee; padding: 1rem; text-align: center; }
  `]
})
export class AppComponent {
  title = 'Shop Frontend';
}
