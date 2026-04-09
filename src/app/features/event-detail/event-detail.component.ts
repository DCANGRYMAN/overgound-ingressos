import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  template: `
    @if (event) {
      <div class="detail-page">
        <div class="detail-hero">
          <img [src]="event.image" [alt]="event.name" class="detail-img">
          <div class="detail-overlay"></div>
          <button class="back-btn" (click)="back()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>
          </button>
          <button class="fav-hero-btn" (click)="toggleFav()" [class.active]="isFav">
            <svg viewBox="0 0 24 24" [attr.fill]="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
          <div class="hero-bottom">
            <span class="tag" [class]="'tag-'+event.category">{{ catLabel }}</span>
            @if (event.availableTickets < 500) {
              <span class="urgency-badge">🔥 Últimas vagas</span>
            }
          </div>
        </div>

        <div class="detail-body">
          <div class="detail-meta-row">
            <span class="meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{{ event.date | date:'dd MMM yyyy':'':'pt-BR' }}</span>
            <span class="meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>{{ event.time }}h</span>
          </div>
          <div class="detail-meta-row">
            <span class="meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{{ event.venue }}</span>
          </div>
          <div class="detail-meta-row"><span class="meta-item small">{{ event.address }}</span></div>

          <h1 class="detail-title">{{ event.name }}</h1>

          <div class="tags-row">
            @for (tag of event.tags; track tag) {
              <span class="tech-tag"># {{ tag }}</span>
            }
          </div>

          <div class="about-section">
            <h2 class="section-title">Sobre o evento</h2>
            <p class="about-text">{{ event.longDescription }}</p>
          </div>

          <div class="capacity-section">
            <div class="capacity-header">
              <span class="capacity-label">Disponibilidade</span>
              <span class="capacity-value">{{ event.availableTickets }} / {{ event.capacity }} vagas</span>
            </div>
            <div class="capacity-bar">
              <div class="capacity-fill" [style.width.%]="(event.availableTickets / event.capacity) * 100"></div>
            </div>
          </div>

          <div class="price-section">
            <div class="price-info">
              <div class="price-block">
                <span class="price-label">Standard</span>
                <span class="price-val">{{ event.price | currency:'BRL':'symbol':'1.0-0' }}</span>
              </div>
              @if (event.priceVip) {
                <div class="price-block vip">
                  <span class="price-label">VIP</span>
                  <span class="price-val">{{ event.priceVip | currency:'BRL':'symbol':'1.0-0' }}</span>
                </div>
              }
            </div>
            <a [routerLink]="['/checkout', event.id]" class="btn-primary buy-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>
              Comprar ingresso
            </a>
          </div>

          <div class="exclusivity-banner">
            <div class="exc-icon">✦</div>
            <div>
              <p class="exc-title">Experiência premium garantida</p>
              <p class="exc-sub">Selecionado pela curadoria Overground</p>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found"><p>Evento não encontrado.</p><a routerLink="/events" class="btn-outline">Ver eventos</a></div>
    }
  `,
  styles: [`
    .detail-page{animation:fadeIn .4s ease}
    .detail-hero{position:relative;height:280px;overflow:hidden}
    .detail-img{width:100%;height:100%;object-fit:cover}
    .detail-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,15,.4) 0%,rgba(10,10,15,.85) 100%)}
    .back-btn,.fav-hero-btn{position:absolute;top:16px;background:rgba(10,10,15,.6);backdrop-filter:blur(10px);border:1px solid var(--border);border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-primary);transition:all .2s}
    .back-btn{left:16px}
    .fav-hero-btn{right:16px}
    .back-btn svg,.fav-hero-btn svg{width:18px;height:18px}
    .fav-hero-btn.active{color:#f43f5e;border-color:rgba(244,63,94,.4)}
    .hero-bottom{position:absolute;bottom:16px;left:16px;display:flex;gap:8px;align-items:center}
    .urgency-badge{background:rgba(245,158,11,.9);color:#000;font-family:var(--font-mono);font-size:.6rem;font-weight:700;padding:3px 10px;border-radius:5px;text-transform:uppercase;letter-spacing:.06em}
    .detail-body{padding:20px}
    .detail-meta-row{display:flex;gap:16px;margin-bottom:6px}
    .meta-item{display:flex;align-items:center;gap:5px;font-family:var(--font-mono);font-size:.7rem;color:var(--text-secondary);letter-spacing:.03em}
    .meta-item svg{width:12px;height:12px;color:var(--accent);flex-shrink:0}
    .meta-item.small{font-size:.65rem;color:var(--text-muted)}
    .detail-title{font-family:var(--font-display);font-size:1.6rem;font-weight:800;letter-spacing:-.03em;line-height:1.2;margin:14px 0 12px}
    .tags-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px}
    .tech-tag{font-family:var(--font-mono);font-size:.65rem;color:var(--text-muted);letter-spacing:.06em;padding:3px 8px;border:1px solid var(--border);border-radius:5px}
    .about-section{margin-bottom:24px}
    .section-title{font-family:var(--font-display);font-size:.85rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--accent-bright);margin-bottom:10px}
    .about-text{font-size:.875rem;color:var(--text-secondary);line-height:1.7}
    .capacity-section{margin-bottom:24px}
    .capacity-header{display:flex;justify-content:space-between;margin-bottom:8px}
    .capacity-label{font-family:var(--font-mono);font-size:.7rem;color:var(--text-muted);letter-spacing:.06em;text-transform:uppercase}
    .capacity-value{font-family:var(--font-mono);font-size:.7rem;color:var(--text-secondary)}
    .capacity-bar{height:4px;background:var(--bg-elevated);border-radius:2px;overflow:hidden}
    .capacity-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-bright));border-radius:2px;transition:width .4s ease}
    .price-section{display:flex;flex-direction:column;gap:16px;margin-bottom:20px}
    .price-info{display:flex;gap:16px}
    .price-block{display:flex;flex-direction:column;gap:2px;flex:1;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px}
    .price-block.vip{border-color:rgba(124,58,237,.3)}
    .price-label{font-family:var(--font-mono);font-size:.65rem;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase}
    .price-val{font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:var(--accent-bright)}
    .buy-btn{width:100%;justify-content:center;padding:16px;font-size:1rem;border-radius:var(--radius)}
    .exclusivity-banner{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,rgba(124,58,237,.1),rgba(6,182,212,.05));border:1px solid rgba(124,58,237,.2);border-radius:var(--radius);padding:14px;margin-bottom:20px}
    .exc-icon{font-size:1.4rem;color:var(--accent-bright)}
    .exc-title{font-family:var(--font-display);font-size:.85rem;font-weight:700;color:var(--text-primary)}
    .exc-sub{font-size:.75rem;color:var(--text-muted);margin-top:2px}
    .not-found{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;gap:16px;color:var(--text-muted)}
  `]
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(EventsService);
  event: Event | undefined;
  get isFav() { return this.event ? this.svc.isFavorite(this.event.id) : false; }
  get catLabel() {
    const map: Record<string,string> = {conferencia:'Conferência',feira:'Feira',exposicao:'Exposição',festival:'Festival'};
    return this.event ? map[this.event.category] : '';
  }
  ngOnInit() { this.route.params.subscribe(p => { this.event = this.svc.getById(p['id']); }); }
  back() { this.router.navigate(['/events']); }
  toggleFav() { if(this.event) this.svc.toggleFavorite(this.event.id); }
}
