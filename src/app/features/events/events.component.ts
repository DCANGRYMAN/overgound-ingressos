import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../core/services/events.service';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';
import { EventCategory } from '../../core/models/event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent],
  template: `
    <div class="events-page">
      <div class="page-header">
        <h1 class="page-title">Eventos</h1>
        <p class="page-sub">{{ filtered.length }} evento{{ filtered.length !== 1 ? 's' : '' }} encontrado{{ filtered.length !== 1 ? 's' : '' }}</p>
      </div>

      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" placeholder="Buscar eventos..." [(ngModel)]="searchVal" (ngModelChange)="onSearch($event)">
        @if (searchVal) {
          <button class="clear-btn" (click)="clearSearch()">✕</button>
        }
      </div>

      <div class="filters">
        <div class="filter-scroll">
          <button class="filter-chip" [class.active]="!activeState" (click)="setState('')">Todos</button>
          @for (s of states; track s) {
            <button class="filter-chip" [class.active]="activeState === s" (click)="setState(s)">{{ s }}</button>
          }
        </div>
        <div class="filter-scroll" style="margin-top:8px">
          <button class="filter-chip cat" [class.active]="!activeCat" (click)="setCat('')">Todos</button>
          <button class="filter-chip cat" [class.active]="activeCat==='conferencia'" (click)="setCat('conferencia')">Conferência</button>
          <button class="filter-chip cat" [class.active]="activeCat==='feira'" (click)="setCat('feira')">Feira</button>
          <button class="filter-chip cat" [class.active]="activeCat==='exposicao'" (click)="setCat('exposicao')">Exposição</button>
          <button class="filter-chip cat" [class.active]="activeCat==='festival'" (click)="setCat('festival')">Festival</button>
        </div>
      </div>

      <div class="events-grid">
        @for (event of filtered; track event.id) {
          <app-event-card [event]="event"></app-event-card>
        } @empty {
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p>Nenhum evento encontrado</p>
            <button class="btn-outline" (click)="clearAll()">Limpar filtros</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .events-page{padding:20px}
    .page-header{margin-bottom:20px}
    .page-title{font-family:var(--font-display);font-size:1.8rem;font-weight:800;letter-spacing:-.03em}
    .page-sub{font-family:var(--font-mono);font-size:.7rem;color:var(--text-muted);letter-spacing:.06em;margin-top:4px}
    .search-bar{position:relative;display:flex;align-items:center;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:0 16px;margin-bottom:16px;transition:border-color .2s}
    .search-bar:focus-within{border-color:var(--accent)}
    .search-bar svg{width:16px;height:16px;color:var(--text-muted);flex-shrink:0}
    .search-bar input{flex:1;background:transparent;border:none;outline:none;padding:14px 10px;color:var(--text-primary);font-size:.9rem}
    .search-bar input::placeholder{color:var(--text-muted)}
    .clear-btn{background:none;border:none;color:var(--text-muted);font-size:.8rem;padding:4px;cursor:pointer}
    .filters{margin-bottom:24px}
    .filter-scroll{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px}
    .filter-scroll::-webkit-scrollbar{display:none}
    .filter-chip{flex-shrink:0;padding:7px 14px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text-secondary);font-family:var(--font-mono);font-size:.7rem;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:all .2s}
    .filter-chip:hover{border-color:var(--accent);color:var(--text-primary)}
    .filter-chip.active{background:var(--accent);border-color:var(--accent);color:#fff}
    .events-grid{display:flex;flex-direction:column;gap:16px}
    .empty-state{display:flex;flex-direction:column;align-items:center;gap:16px;padding:60px 20px;color:var(--text-muted)}
    .empty-state svg{width:48px;height:48px}
    .empty-state p{font-size:.9rem}
  `]
})
export class EventsComponent implements OnInit {
  private svc = inject(EventsService);
  private route = inject(ActivatedRoute);
  searchVal = '';
  activeState = '';
  activeCat: EventCategory | '' = '';
  get filtered() { return this.svc.filteredEvents(); }
  get states() { return this.svc.getStates(); }

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p['state']) { this.activeState = p['state']; this.svc.setState(p['state']); }
    });
  }
  onSearch(v: string) { this.svc.setSearch(v); }
  setState(s: string) { this.activeState = s; this.svc.setState(s); }
  setCat(c: EventCategory | '') { this.activeCat = c; this.svc.setCategory(c); }
  clearSearch() { this.searchVal = ''; this.svc.setSearch(''); }
  clearAll() { this.searchVal = ''; this.activeState = ''; this.activeCat = ''; this.svc.setSearch(''); this.svc.setState(''); this.svc.setCategory(''); }
}
