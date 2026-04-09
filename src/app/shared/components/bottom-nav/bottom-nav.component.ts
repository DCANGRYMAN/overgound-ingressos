import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
        <span>Home</span>
      </a>
      <a routerLink="/events" routerLinkActive="active" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <span>Eventos</span>
      </a>
      <a routerLink="/account" routerLinkActive="active" class="nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Conta</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav { position:fixed;bottom:0;left:0;right:0;height:var(--bottom-nav);background:rgba(10,10,15,0.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-around;z-index:100;padding-bottom:env(safe-area-inset-bottom); }
    .nav-item { display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 20px;color:var(--text-muted);transition:color 0.2s;font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.06em;text-transform:uppercase; }
    .nav-item svg { width:22px;height:22px; }
    .nav-item.active { color:var(--accent-bright); }
    .nav-item:hover { color:var(--text-secondary); }
  `]
})
export class BottomNavComponent {}
