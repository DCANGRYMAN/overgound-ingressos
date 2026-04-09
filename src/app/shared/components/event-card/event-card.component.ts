import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Event } from '../../../core/models/event.model';
import { EventsService } from '../../../core/services/events.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, DatePipe],
  template: `
    <a [routerLink]="['/events', event.id]" class="card">
      <div class="card-image">
        <img [src]="event.image" [alt]="event.name" loading="lazy">
        <div class="card-overlay"></div>
        <span class="tag" [class]="'tag-'+event.category">{{ categoryLabel }}</span>
        <button class="fav-btn" (click)="toggleFav($event)" [class.active]="isFav">
          <svg viewBox="0 0 24 24" [attr.fill]="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
        @if (event.availableTickets < 500) {
          <span class="sold-out-badge">Últimas vagas</span>
        }
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ event.name }}</h3>
        <p class="card-desc">{{ event.description }}</p>
        <div class="card-meta">
          <div class="meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>{{ event.date | date:'dd MMM yyyy':'':'pt-BR' }}</span>
          </div>
          <div class="meta-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{{ event.city }}, {{ event.state }}</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="price">
            <span class="price-from">a partir de</span>
            <span class="price-value">{{ event.price | currency:'BRL':'symbol':'1.0-0' }}</span>
          </div>
          <span class="cta-arrow">→</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .card { display:block;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;transition:all 0.3s ease;text-decoration:none; }
    .card:hover { border-color:var(--border-hover);transform:translateY(-2px);box-shadow:0 16px 40px rgba(0,0,0,0.4); }
    .card-image { position:relative;aspect-ratio:16/9;overflow:hidden; }
    .card-image img { width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease; }
    .card:hover .card-image img { transform:scale(1.04); }
    .card-overlay { position:absolute;inset:0;background:linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.9) 100%); }
    .tag { position:absolute;top:12px;left:12px; }
    .fav-btn { position:absolute;top:10px;right:10px;background:rgba(10,10,15,0.6);backdrop-filter:blur(8px);border:none;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);transition:all 0.2s;cursor:pointer; }
    .fav-btn svg { width:16px;height:16px; }
    .fav-btn.active { color:#f43f5e; }
    .fav-btn:hover { color:#f43f5e;background:rgba(244,63,94,0.15); }
    .sold-out-badge { position:absolute;bottom:12px;right:12px;background:rgba(245,158,11,0.9);color:#000;font-family:var(--font-mono);font-size:0.6rem;font-weight:700;letter-spacing:0.08em;padding:3px 8px;border-radius:5px;text-transform:uppercase; }
    .card-body { padding:16px; }
    .card-title { font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--text-primary);margin-bottom:4px;line-height:1.3; }
    .card-desc { font-size:0.8rem;color:var(--text-secondary);line-height:1.5;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
    .card-meta { display:flex;flex-direction:column;gap:4px;margin-bottom:12px; }
    .meta-row { display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text-muted); }
    .meta-row svg { width:12px;height:12px;flex-shrink:0; }
    .card-footer { display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border); }
    .price { display:flex;flex-direction:column; }
    .price-from { font-size:0.65rem;color:var(--text-muted);font-family:var(--font-mono); }
    .price-value { font-family:var(--font-display);font-size:1rem;font-weight:700;color:var(--accent-bright); }
    .cta-arrow { font-size:1.1rem;color:var(--accent);transition:transform 0.2s; }
    .card:hover .cta-arrow { transform:translateX(4px); }
  `]
})
export class EventCardComponent {
  @Input({ required: true }) event!: Event;
  private svc = inject(EventsService);

  get isFav() { return this.svc.isFavorite(this.event.id); }
  get categoryLabel() {
    const map: Record<string, string> = { conferencia: 'Conferência', feira: 'Feira', exposicao: 'Exposição', festival: 'Festival' };
    return map[this.event.category] ?? this.event.category;
  }
  toggleFav(e: Event | MouseEvent) {
    (e as MouseEvent).preventDefault();
    (e as MouseEvent).stopPropagation();
    this.svc.toggleFavorite(this.event.id);
  }
}
