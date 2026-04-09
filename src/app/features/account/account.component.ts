import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TicketsService } from '../../core/services/tickets.service';

type Tab = 'tickets' | 'payments';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, RouterLink],
  template: `
    @if (!auth.isLoggedIn()) {
      <div class="login-page">
        <div class="login-header">
          <div class="login-logo">
            <span class="logo-over">OVER</span><span class="logo-ground">GROUND</span>
          </div>
          <p class="login-sub">Acesse sua conta para gerenciar seus ingressos</p>
        </div>
        <div class="login-form">
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com" [(ngModel)]="email" (keyup.enter)="login()">
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" placeholder="••••••••" [(ngModel)]="password" (keyup.enter)="login()">
          </div>
          @if (loginError) { <p class="login-error">{{ loginError }}</p> }
          <button class="btn-primary login-btn" (click)="login()">Entrar</button>
          <p class="login-hint">Use qualquer e-mail e senha com 4+ caracteres</p>
        </div>
      </div>
    } @else {
      <div class="account-page">
        <div class="account-header">
          <div class="account-avatar">
            <span>{{ auth.user()!.name[0] }}</span>
          </div>
          <div class="account-info">
            <h1 class="account-name">{{ auth.user()!.name }}</h1>
            <p class="account-email">{{ auth.user()!.email }}</p>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Sair</button>
        </div>

        <div class="tab-bar">
          <button class="tab-btn" [class.active]="activeTab==='tickets'" (click)="activeTab='tickets'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:16px;height:16px"><path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 9v10a2 2 0 002 2h16a2 2 0 002-2V9M2 9h20"/></svg>
            Meus ingressos
          </button>
          <button class="tab-btn" [class.active]="activeTab==='payments'" (click)="activeTab='payments'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:16px;height:16px"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Pagamentos
          </button>
        </div>

        @if (activeTab === 'tickets') {
          <div class="tab-content">
            @if (tickets.tickets().length === 0) {
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;color:var(--text-muted)"><path d="M2 9a3 3 0 010-6h20a3 3 0 010 6M2 9v10a2 2 0 002 2h16a2 2 0 002-2V9M2 9h20"/></svg>
                <p>Nenhum ingresso ainda</p>
                <a routerLink="/events" class="btn-primary">Explorar eventos</a>
              </div>
            } @else {
              @for (ticket of tickets.tickets(); track ticket.id) {
                <div class="ticket-card" [class.confirmed]="ticket.status==='confirmed'">
                  <div class="ticket-card-header">
                    <div>
                      <p class="tc-event">{{ ticket.eventName }}</p>
                      <p class="tc-date">{{ ticket.eventDate | date:'dd MMM yyyy':'':'pt-BR' }}</p>
                      <p class="tc-venue">{{ ticket.eventVenue }}</p>
                    </div>
                    <span class="status-badge" [class]="'status-'+ticket.status">{{ statusLabel(ticket.status) }}</span>
                  </div>
                  <div class="ticket-card-body">
                    <div class="tc-info">
                      <span class="tc-type">{{ ticket.type === 'vip' ? '✦ VIP' : 'Standard' }}</span>
                      <span class="tc-id">{{ ticket.id }}</span>
                    </div>
                    <div class="tc-qr" [class.expanded]="expandedQR===ticket.id" (click)="toggleQR(ticket.id)">
                      @if (expandedQR === ticket.id) {
                        <img [src]="ticket.qrCode" alt="QR Code" class="qr-img">
                        <p class="qr-hint">QR Code de entrada</p>
                      } @else {
                        <div class="qr-placeholder">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:20px;height:20px"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>
                          <span>Ver QR Code</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        }

        @if (activeTab === 'payments') {
          <div class="tab-content">
            @if (tickets.payments().length === 0) {
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;color:var(--text-muted)"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <p>Nenhum pagamento ainda</p>
              </div>
            } @else {
              @for (payment of tickets.payments(); track payment.id) {
                <div class="payment-card">
                  <div class="pc-left">
                    <div class="pc-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div>
                      <p class="pc-event">{{ payment.eventName }}</p>
                      <p class="pc-date">{{ payment.date | date:'dd/MM/yyyy':'':'pt-BR' }} · {{ payment.method }}</p>
                    </div>
                  </div>
                  <div class="pc-right">
                    <span class="pc-amount" [class.paid]="payment.status==='paid'">{{ payment.amount | currency:'BRL':'symbol':'1.0-0' }}</span>
                    <span class="status-badge" [class]="'status-'+payment.status">{{ statusLabel(payment.status) }}</span>
                  </div>
                </div>
              }
            }
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .login-page{min-height:calc(100vh - var(--nav-height) - var(--bottom-nav));display:flex;flex-direction:column;justify-content:center;padding:40px 24px}
    .login-header{text-align:center;margin-bottom:40px}
    .login-logo{font-family:var(--font-display);font-size:2rem;font-weight:800;letter-spacing:-.03em}
    .logo-over{color:var(--text-primary)}
    .logo-ground{color:var(--accent-bright)}
    .login-sub{font-size:.85rem;color:var(--text-secondary);margin-top:8px;line-height:1.5}
    .login-form{display:flex;flex-direction:column;gap:16px}
    .form-group{display:flex;flex-direction:column;gap:6px}
    .form-group label{font-family:var(--font-mono);font-size:.65rem;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase}
    .form-group input{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;color:var(--text-primary);font-size:.95rem;outline:none;transition:border-color .2s}
    .form-group input:focus{border-color:var(--accent)}
    .login-error{font-size:.8rem;color:#f43f5e;text-align:center}
    .login-btn{width:100%;justify-content:center;padding:16px;font-size:.95rem}
    .login-hint{text-align:center;font-size:.75rem;color:var(--text-muted)}
    .account-page{padding:20px;animation:fadeIn .4s ease}
    .account-header{display:flex;align-items:center;gap:14px;margin-bottom:28px;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg)}
    .account-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-bright));display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.2rem;font-weight:700;flex-shrink:0}
    .account-info{flex:1}
    .account-name{font-family:var(--font-display);font-size:1rem;font-weight:700}
    .account-email{font-size:.75rem;color:var(--text-muted);margin-top:2px}
    .logout-btn{background:none;border:1px solid var(--border);border-radius:8px;padding:6px 12px;font-family:var(--font-mono);font-size:.65rem;color:var(--text-muted);cursor:pointer;letter-spacing:.06em;text-transform:uppercase;transition:all .2s}
    .logout-btn:hover{border-color:#f43f5e;color:#f43f5e}
    .tab-bar{display:flex;border-bottom:1px solid var(--border);margin-bottom:20px}
    .tab-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:14px;background:none;border:none;border-bottom:2px solid transparent;color:var(--text-muted);font-family:var(--font-display);font-size:.8rem;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.04em;margin-bottom:-1px}
    .tab-btn.active{color:var(--accent-bright);border-bottom-color:var(--accent-bright)}
    .tab-content{display:flex;flex-direction:column;gap:14px}
    .empty-state{display:flex;flex-direction:column;align-items:center;gap:16px;padding:60px 20px;color:var(--text-muted)}
    .empty-state p{font-size:.9rem}
    .ticket-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;transition:border-color .2s}
    .ticket-card.confirmed{border-color:rgba(16,185,129,.2)}
    .ticket-card-header{display:flex;justify-content:space-between;align-items:flex-start;padding:16px;border-bottom:1px dashed var(--border)}
    .tc-event{font-family:var(--font-display);font-size:.95rem;font-weight:700}
    .tc-date{font-family:var(--font-mono);font-size:.65rem;color:var(--text-secondary);margin-top:3px;letter-spacing:.04em}
    .tc-venue{font-size:.75rem;color:var(--text-muted);margin-top:2px}
    .status-badge{font-family:var(--font-mono);font-size:.6rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:4px 8px;border-radius:5px;flex-shrink:0}
    .status-confirmed{background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.3)}
    .status-pending{background:rgba(245,158,11,.12);color:#fbbf24;border:1px solid rgba(245,158,11,.3)}
    .status-cancelled{background:rgba(244,63,94,.12);color:#f87171;border:1px solid rgba(244,63,94,.3)}
    .status-paid{background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.3)}
    .status-failed{background:rgba(244,63,94,.12);color:#f87171;border:1px solid rgba(244,63,94,.3)}
    .ticket-card-body{padding:14px;display:flex;justify-content:space-between;align-items:center}
    .tc-info{display:flex;flex-direction:column;gap:4px}
    .tc-type{font-family:var(--font-display);font-size:.8rem;font-weight:700;color:var(--accent-bright)}
    .tc-id{font-family:var(--font-mono);font-size:.65rem;color:var(--text-muted);letter-spacing:.06em}
    .tc-qr{cursor:pointer}
    .qr-placeholder{display:flex;flex-direction:column;align-items:center;gap:4px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text-muted);font-size:.7rem;transition:all .2s}
    .qr-placeholder:hover{border-color:var(--accent);color:var(--accent-bright)}
    .tc-qr.expanded{display:flex;flex-direction:column;align-items:center;gap:6px}
    .qr-img{width:100px;height:100px;border-radius:8px}
    .qr-hint{font-family:var(--font-mono);font-size:.6rem;color:var(--text-muted);text-align:center}
    .payment-card{display:flex;align-items:center;justify-content:space-between;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:14px}
    .pc-left{display:flex;align-items:center;gap:12px}
    .pc-icon{width:36px;height:36px;border-radius:50%;background:var(--bg-elevated);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-muted);flex-shrink:0}
    .pc-event{font-family:var(--font-display);font-size:.85rem;font-weight:700}
    .pc-date{font-family:var(--font-mono);font-size:.65rem;color:var(--text-muted);margin-top:2px;letter-spacing:.03em}
    .pc-right{display:flex;flex-direction:column;align-items:flex-end;gap:5px}
    .pc-amount{font-family:var(--font-display);font-size:.95rem;font-weight:800;color:var(--text-muted)}
    .pc-amount.paid{color:var(--success)}
  `]
})
export class AccountComponent {
  auth = inject(AuthService);
  tickets = inject(TicketsService);
  activeTab: Tab = 'tickets';
  email = ''; password = ''; loginError = '';
  expandedQR: string | null = null;

  login() {
    if (this.auth.login(this.email, this.password)) { this.loginError = ''; }
    else { this.loginError = 'E-mail ou senha inválidos'; }
  }
  statusLabel(s: string) {
    const m: Record<string,string> = {confirmed:'Confirmado',pending:'Pendente',cancelled:'Cancelado',paid:'Pago',failed:'Falhou'};
    return m[s] ?? s;
  }
  toggleQR(id: string) { this.expandedQR = this.expandedQR === id ? null : id; }
}
