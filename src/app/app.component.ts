import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>Angular Signal Forms Examples</h1>
        <nav class="nav">
          <a
            routerLink="/basic-form"
            routerLinkActive="active"
            class="nav-link"
          >
            Basic Form
          </a>
          <a
            routerLink="/schema-validation"
            routerLinkActive="active"
            class="nav-link"
          >
            Schema Validation
          </a>
          <a
            routerLink="/validators-example"
            routerLinkActive="active"
            class="nav-link"
          >
            Custom Validators
          </a>
          <a
            routerLink="/async-validation"
            routerLinkActive="active"
            class="nav-link"
          >
            Async Validation
          </a>
          <a
            routerLink="/conditional-logic"
            routerLinkActive="active"
            class="nav-link"
          >
            Conditional Logic
          </a>
          <a
            routerLink="/nested-forms"
            routerLinkActive="active"
            class="nav-link"
          >
            Nested Forms
          </a>
          <a
            routerLink="/form-arrays"
            routerLinkActive="active"
            class="nav-link"
          >
            Form Arrays
          </a>
          <a
            routerLink="/custom-controls"
            routerLinkActive="active"
            class="nav-link"
          >
            Custom Controls
          </a>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        background: #f8f9fa;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .header {
        background: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1rem 2rem;
        margin-bottom: 2rem;
      }

      .header h1 {
        color: #2c3e50;
        margin: 0 0 1rem 0;
        font-size: 1.8rem;
        font-weight: 600;
      }

      .nav {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .nav-link {
        padding: 0.4rem 0.8rem;
        text-decoration: none;
        color: #6c757d;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-weight: 500;
        font-size: 0.9rem;
        white-space: nowrap;
      }

      .nav-link:hover {
        background: #e9ecef;
        color: #495057;
      }

      .nav-link.active {
        background: #3498db;
        color: white;
      }

      .main-content {
        padding: 0 1rem;
      }

      @media (max-width: 768px) {
        .header {
          padding: 1rem;
        }

        .nav {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'Angular Signal Forms Examples';
}
