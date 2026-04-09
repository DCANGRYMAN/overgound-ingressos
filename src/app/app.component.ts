import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, BottomNavComponent],
  template: `
    <div class="noise-overlay"></div>
    <app-nav></app-nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-bottom-nav></app-bottom-nav>
  `,
  styles: [`
    .main-content {
      min-height: 100vh;
      padding-top: var(--nav-height);
      padding-bottom: var(--bottom-nav);
    }
  `]
})
export class AppComponent {}
