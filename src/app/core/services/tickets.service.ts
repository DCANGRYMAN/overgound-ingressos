import { Injectable, signal, computed } from '@angular/core';
import { Ticket, Payment } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly _tickets = signal<Ticket[]>(this.load('og_tickets', []));
  private readonly _payments = signal<Payment[]>(this.load('og_payments', []));

  readonly tickets = computed(() => this._tickets());
  readonly payments = computed(() => this._payments());

  purchase(ticket: Omit<Ticket, 'id' | 'purchaseDate' | 'qrCode'>, payment: Omit<Payment, 'id' | 'ticketId'>): Ticket {
    const id = 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTicket: Ticket = {
      ...ticket,
      id,
      purchaseDate: new Date().toISOString(),
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=OVERGROUND-${id}`
    };
    const payId = 'PAY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newPayment: Payment = { ...payment, id: payId, ticketId: id };
    const updatedTickets = [...this._tickets(), newTicket];
    const updatedPayments = [...this._payments(), newPayment];
    this._tickets.set(updatedTickets);
    this._payments.set(updatedPayments);
    localStorage.setItem('og_tickets', JSON.stringify(updatedTickets));
    localStorage.setItem('og_payments', JSON.stringify(updatedPayments));
    return newTicket;
  }

  private load<T>(key: string, fallback: T): T {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
  }
}
