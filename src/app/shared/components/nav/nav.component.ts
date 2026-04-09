import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="nav">
      <div class="nav-inner">
        <a routerLink="/" class="brand">
          <span class="brand-over">OVER</span><span class="brand-ground">GROUND</span>
          <span class="brand-by">by Oziris</span>
        </a>
        <div class="nav-actions">
          @if (auth.isLoggedIn()) {
            <a routerLink="/account" class="avatar-btn">
              <span class="avatar-initial">{{ auth.user()!.name[0] }}</span>
            </a>
          } @else {
            <a routerLink="/account" class="login-btn">Entrar</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav { position:fixed;top:0;left:0;right:0;height:var(--nav-height);background:rgba(10,10,15,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);z-index:100; }
    .nav-inner { max-width:480px;margin:0 auto;padding:0 20px;height:100%;display:flex;align-items:center;justify-content:space-between; }
    .brand { display:flex;align-items:baseline;gap:2px;font-family:var(--font-display);font-weight:800;font-size:1.1rem;letter-spacing:-0.02em; }
    .brand-over { color:var(--text-primary); }
    .brand-ground { color:var(--accent-bright); }
    .brand-by { margin-left:8px;font-family:var(--font-mono);font-size:0.55rem;color:var(--text-muted);letter-spacing:0.1em;text-transform:uppercase;align-self:center; }
    .login-btn { font-family:var(--font-display);font-size:0.8rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent-bright);padding:6px 14px;border:1px solid rgba(168,85,247,0.3);border-radius:8px;transition:all 0.2s; }
    .login-btn:hover { background:rgba(124,58,237,0.15); }
    .avatar-btn { width:36px;height:36px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;background:var(--bg-elevated); }
    .avatar-initial { font-family:var(--font-display);font-weight:700;font-size:0.85rem;color:var(--accent-bright); }
  `]
})
export class NavComponent {
  auth = inject(AuthService);
}
