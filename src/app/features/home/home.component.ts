import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../core/services/events.service';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, EventCardComponent],
  template: `
    <section class="hero">
      <div class="hero-bg">
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80" alt="hero" class="hero-img">
        <div class="hero-gradient"></div>
        <div class="hero-grid"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge"><span class="badge-dot"></span><span>São Paulo · Brasil · 2025</span></div>
        <h1 class="hero-title">Os maiores eventos de eletrônica<br><span class="hero-accent">do Brasil</span></h1>
        <p class="hero-sub">Descubra experiências únicas e de alto nível</p>
        <a routerLink="/events" class="btn-primary hero-cta">Explorar eventos <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></a>
      </div>
      <div class="hero-stats">
        <div class="stat"><span class="stat-num">15+</span><span class="stat-label">Eventos</span></div>
        <div class="stat-divider"></div>
        <div class="stat"><span class="stat-num">8</span><span class="stat-label">Estados</span></div>
        <div class="stat-divider"></div>
        <div class="stat"><span class="stat-num">100k+</span><span class="stat-label">Participantes</span></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header"><div class="section-label"><span class="label-line"></span><span>Em destaque</span></div><a routerLink="/events" class="section-link">Ver todos →</a></div>
      </div>
      <div class="carousel">
        @for (event of featured; track event.id) {
          <div class="carousel-item"><app-event-card [event]="event"></app-event-card></div>
        }
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header"><div class="section-label"><span class="label-line"></span><span>Por região</span></div></div>
        <div class="regions-grid">
          @for (region of regions; track region.state) {
            <a [routerLink]="['/events']" [queryParams]="{state: region.state}" class="region-card">
              <span class="region-state">{{ region.state }}</span>
              <span class="region-name">{{ region.city }}</span>
              <span class="region-count">{{ region.count }} evento{{ region.count > 1 ? 's' : '' }}</span>
            </a>
          }
        </div>
        <div class="section-header" style="margin-top:40px"><div class="section-label"><span class="label-line"></span><span>Próximos eventos</span></div><a routerLink="/events" class="section-link">Ver todos →</a></div>
        <div class="events-list">
          @for (event of upcoming; track event.id) {
            <app-event-card [event]="event"></app-event-card>
          }
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-glow"></div>
          <h2 class="cta-title">Experiências premium.<br>Acesso exclusivo.</h2>
          <p class="cta-text">Ingressos para os maiores eventos de tecnologia do país em um só lugar.</p>
          <a routerLink="/events" class="btn-primary">Explorar agora</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero{position:relative;min-height:90vw;max-height:540px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
    .hero-bg{position:absolute;inset:0}
    .hero-img{width:100%;height:100%;object-fit:cover}
    .hero-gradient{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,10,15,.3) 0%,rgba(10,10,15,.97) 100%)}
    .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(124,58,237,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.05) 1px,transparent 1px);background-size:40px 40px}
    .hero-content{position:relative;z-index:2;padding:24px 24px 20px}
    .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3);border-radius:20px;padding:5px 12px;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.08em;color:var(--accent-bright);text-transform:uppercase;margin-bottom:16px}
    .badge-dot{width:6px;height:6px;border-radius:50%;background:var(--accent-bright);animation:pulse-glow 2s infinite}
    .hero-title{font-family:var(--font-display);font-size:clamp(1.6rem,8vw,2.2rem);font-weight:800;line-height:1.15;letter-spacing:-.03em;color:var(--text-primary);margin-bottom:10px}
    .hero-accent{color:var(--accent-bright)}
    .hero-sub{font-size:.9rem;color:var(--text-secondary);margin-bottom:20px;line-height:1.5}
    .hero-stats{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;padding:16px 24px;background:rgba(15,15,24,.85);border-top:1px solid var(--border)}
    .stat{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px}
    .stat-num{font-family:var(--font-display);font-size:1.1rem;font-weight:800;color:var(--accent-bright)}
    .stat-label{font-family:var(--font-mono);font-size:.6rem;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase}
    .stat-divider{width:1px;height:30px;background:var(--border)}
    .section{padding:32px 0}
    .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
    .section-label{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:.9rem;font-weight:700;color:var(--text-primary);text-transform:uppercase;letter-spacing:.04em}
    .label-line{width:20px;height:2px;background:var(--accent-bright);border-radius:1px}
    .section-link{font-family:var(--font-mono);font-size:.7rem;color:var(--accent-bright);letter-spacing:.06em}
    .carousel{display:flex;gap:16px;overflow-x:auto;padding:0 20px;scrollbar-width:none;-ms-overflow-style:none}
    .carousel::-webkit-scrollbar{display:none}
    .carousel-item{flex:0 0 280px}
    .regions-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .region-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:2px;transition:all .25s;cursor:pointer}
    .region-card:hover{border-color:var(--border-hover);background:var(--bg-elevated)}
    .region-state{font-family:var(--font-mono);font-size:.65rem;color:var(--accent-bright);letter-spacing:.1em;text-transform:uppercase}
    .region-name{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--text-primary)}
    .region-count{font-size:.75rem;color:var(--text-muted)}
    .events-list{display:flex;flex-direction:column;gap:16px}
    .cta-section{padding:32px 0 20px}
    .cta-card{position:relative;background:var(--bg-card);border:1px solid rgba(124,58,237,.25);border-radius:var(--radius-xl);padding:36px 24px;text-align:center;overflow:hidden}
    .cta-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:200px;height:200px;background:radial-gradient(circle,rgba(124,58,237,.25) 0%,transparent 70%);pointer-events:none}
    .cta-title{font-family:var(--font-display);font-size:1.4rem;font-weight:800;line-height:1.25;margin-bottom:10px;letter-spacing:-.02em}
    .cta-text{font-size:.85rem;color:var(--text-secondary);margin-bottom:24px;line-height:1.6}
  `]
})
export class HomeComponent {
  private svc = inject(EventsService);
  featured = this.svc.featuredEvents().slice(0, 5);
  upcoming = this.svc.events().slice(0, 4);
  get regions() {
    const map = new Map<string, {city:string;state:string;count:number}>();
    this.svc.events().forEach(e => { if(!map.has(e.state)) map.set(e.state,{city:e.city,state:e.state,count:0}); map.get(e.state)!.count++; });
    return [...map.values()].sort((a,b)=>b.count-a.count);
  }
}
