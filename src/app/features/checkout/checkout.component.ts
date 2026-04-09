import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  DestroyRef,
} from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EventsService } from "../../core/services/events.service";
import { TicketsService } from "../../core/services/tickets.service";
import { AuthService } from "../../core/services/auth.service";
import { Event } from "../../core/models/event.model";

type Step = "select" | "payment" | "confirmed";
type TicketType = "standard" | "vip";
type PaymentMethod = "pix" | "card";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, RouterLink],
  template: `
    @if (event()) {
      <div class="checkout-page">
        <div class="checkout-header">
          <button
            class="back-btn"
            (click)="back()"
            aria-label="Voltar"
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              style="width:18px;height:18px"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12,19 5,12 12,5" />
            </svg>
          </button>
          <h1 class="checkout-title">Comprar ingresso</h1>
          <div
            class="step-indicator"
            role="progressbar"
            [attr.aria-valuenow]="currentStepNumber"
            aria-valuemin="1"
            aria-valuemax="3"
          >
            <span
              class="step"
              [class.done]="step() !== 'select'"
              [class.active]="step() === 'select'"
              >1</span
            >
            <div class="step-line" aria-hidden="true"></div>
            <span
              class="step"
              [class.done]="step() === 'confirmed'"
              [class.active]="step() === 'payment'"
              >2</span
            >
            <div class="step-line" aria-hidden="true"></div>
            <span class="step" [class.active]="step() === 'confirmed'">3</span>
          </div>
        </div>

        <div class="event-summary-card">
          <img
            [src]="event()!.image"
            [alt]="event()!.name"
            class="summary-img"
          />
          <div class="summary-info">
            <p class="summary-name">{{ event()!.name }}</p>
            <p class="summary-date">
              {{ event()!.date | date: "dd MMM yyyy" : "" : "pt-BR" }} ·
              {{ event()!.time }}h
            </p>
            <p class="summary-venue">{{ event()!.venue }}</p>
          </div>
        </div>

        @if (step() === "select") {
          <div class="section-block">
            <h2 class="block-title">Selecione seu ingresso</h2>
            <div
              class="ticket-options"
              role="radiogroup"
              aria-label="Tipo de ingresso"
            >
              <div
                class="ticket-option"
                [class.selected]="ticketType() === 'standard'"
                (click)="setTicketType('standard')"
                (keydown.enter)="setTicketType('standard')"
                (keydown.space)="setTicketType('standard')"
                role="radio"
                [attr.aria-checked]="ticketType() === 'standard'"
                tabindex="0"
              >
                <div
                  class="ticket-radio"
                  [class.active]="ticketType() === 'standard'"
                  aria-hidden="true"
                ></div>
                <div class="ticket-info">
                  <span class="ticket-name">Standard</span>
                  <span class="ticket-desc">Acesso geral ao evento</span>
                </div>
                <span class="ticket-price">{{
                  event()!.price | currency: "BRL" : "symbol" : "1.0-0"
                }}</span>
              </div>
              @if (event()!.priceVip) {
                <div
                  class="ticket-option vip-option"
                  [class.selected]="ticketType() === 'vip'"
                  (click)="setTicketType('vip')"
                  (keydown.enter)="setTicketType('vip')"
                  (keydown.space)="setTicketType('vip')"
                  role="radio"
                  [attr.aria-checked]="ticketType() === 'vip'"
                  tabindex="0"
                >
                  <div
                    class="ticket-radio"
                    [class.active]="ticketType() === 'vip'"
                    aria-hidden="true"
                  ></div>
                  <div class="ticket-info">
                    <span class="ticket-name"
                      >VIP <span class="vip-tag">✦ Premium</span></span
                    >
                    <span class="ticket-desc"
                      >Área VIP + open bar + brindes</span
                    >
                  </div>
                  <span class="ticket-price">{{
                    event()!.priceVip | currency: "BRL" : "symbol" : "1.0-0"
                  }}</span>
                </div>
              }
            </div>
            <div class="qty-row">
              <span class="qty-label" id="qty-label">Quantidade</span>
              <div class="qty-controls">
                <button
                  (click)="decrementQty()"
                  class="qty-btn"
                  [disabled]="qty() <= MIN_TICKETS"
                  aria-label="Diminuir quantidade"
                  type="button"
                >
                  −
                </button>
                <span
                  class="qty-val"
                  aria-live="polite"
                  aria-labelledby="qty-label"
                  >{{ qty() }}</span
                >
                <button
                  (click)="incrementQty()"
                  class="qty-btn"
                  [disabled]="qty() >= MAX_TICKETS"
                  aria-label="Aumentar quantidade"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="order-summary" aria-label="Resumo do pedido">
            <div class="order-row">
              <span>Subtotal ({{ qty() }}x)</span
              ><span>{{
                totalPrice() | currency: "BRL" : "symbol" : "1.0-0"
              }}</span>
            </div>
            <div class="order-row">
              <span>Taxa de serviço</span
              ><span>{{ fee() | currency: "BRL" : "symbol" : "1.0-0" }}</span>
            </div>
            <div class="order-divider" aria-hidden="true"></div>
            <div class="order-row total">
              <span>Total</span
              ><span>{{
                totalWithFee() | currency: "BRL" : "symbol" : "1.0-0"
              }}</span>
            </div>
          </div>
          <button
            class="btn-primary checkout-btn"
            (click)="goToPayment()"
            type="button"
          >
            Continuar para pagamento
          </button>
        }

        @if (step() === "payment") {
          <div class="section-block">
            <h2 class="block-title">Pagamento</h2>
            <div
              class="payment-methods"
              role="radiogroup"
              aria-label="Método de pagamento"
            >
              <button
                class="pm-btn"
                [class.active]="payMethod() === 'pix'"
                (click)="setPayMethod('pix')"
                role="radio"
                [attr.aria-checked]="payMethod() === 'pix'"
                type="button"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  style="width:20px;height:20px"
                  aria-hidden="true"
                >
                  <path
                    d="M8.5 8.5L12 5l3.5 3.5M15.5 15.5L12 19l-3.5-3.5M5 12l3.5-3.5L12 12l-3.5 3.5L5 12zM19 12l-3.5-3.5L12 12l3.5 3.5L19 12z"
                  />
                </svg>
                PIX
              </button>
              <button
                class="pm-btn"
                [class.active]="payMethod() === 'card'"
                (click)="setPayMethod('card')"
                role="radio"
                [attr.aria-checked]="payMethod() === 'card'"
                type="button"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  style="width:20px;height:20px"
                  aria-hidden="true"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Cartão
              </button>
            </div>

            @if (payMethod() === "card") {
              <div class="card-form">
                <div class="form-group">
                  <label for="cardNum">Número do cartão</label>
                  <input
                    id="cardNum"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    [(ngModel)]="cardNum"
                    (ngModelChange)="formatCardNumber()"
                    maxlength="19"
                    #cardNumCtrl="ngModel"
                    required
                    pattern="^d{4} d{4} d{4} d{4}$"
                  />
                  @if (cardNumCtrl.touched && cardNumCtrl.invalid) {
                    <p class="form-error" role="alert">
                      Digite um número de cartão válido
                    </p>
                  }
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="cardExp">Validade</label>
                    <input
                      id="cardExp"
                      type="text"
                      placeholder="MM/AA"
                      [(ngModel)]="cardExp"
                      (ngModelChange)="formatExpiry()"
                      maxlength="5"
                      #cardExpCtrl="ngModel"
                      required
                      pattern="^d{2}/d{2}$"
                    />
                  </div>
                  <div class="form-group">
                    <label for="cardCvv">CVV</label>
                    <input
                      id="cardCvv"
                      type="password"
                      placeholder="123"
                      [(ngModel)]="cardCvv"
                      maxlength="4"
                      #cardCvvCtrl="ngModel"
                      required
                      pattern="^d{3,4}$"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="cardName">Nome no cartão</label>
                  <input
                    id="cardName"
                    type="text"
                    placeholder="SEU NOME"
                    [(ngModel)]="cardName"
                    (ngModelChange)="formatCardName()"
                    #cardNameCtrl="ngModel"
                    required
                    minlength="3"
                  />
                  @if (cardNameCtrl.touched && cardNameCtrl.invalid) {
                    <p class="form-error" role="alert">
                      Nome completo é obrigatório
                    </p>
                  }
                </div>
                @if (submitted() && !isCardFormValid()) {
                  <p class="form-error" role="alert">
                    Preencha todos os campos corretamente
                  </p>
                }
              </div>
            }

            @if (payMethod() === "pix") {
              <div class="pix-info">
                <div class="pix-qr">
                  <div class="pix-qr-mock" aria-hidden="true">
                    <svg
                      viewBox="0 0 100 100"
                      fill="var(--text-primary)"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="10"
                        y="10"
                        width="35"
                        height="35"
                        rx="4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <rect x="18" y="18" width="19" height="19" rx="2" />
                      <rect
                        x="55"
                        y="10"
                        width="35"
                        height="35"
                        rx="4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <rect x="63" y="18" width="19" height="19" rx="2" />
                      <rect
                        x="10"
                        y="55"
                        width="35"
                        height="35"
                        rx="4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <rect x="18" y="63" width="19" height="19" rx="2" />
                      <rect x="55" y="55" width="10" height="10" />
                      <rect x="70" y="55" width="10" height="10" />
                      <rect x="55" y="70" width="10" height="10" />
                      <rect x="70" y="70" width="10" height="10" />
                      <rect x="55" y="85" width="10" height="10" />
                    </svg>
                  </div>
                  <p class="pix-val">
                    {{ totalWithFee() | currency: "BRL" : "symbol" : "1.0-0" }}
                  </p>
                  <p class="pix-hint">Escaneie o QR Code no seu app de banco</p>
                </div>
              </div>
            }
          </div>

          <div class="order-summary" aria-label="Resumo do pagamento">
            <div class="order-row total">
              <span>Total a pagar</span
              ><span>{{
                totalWithFee() | currency: "BRL" : "symbol" : "1.0-0"
              }}</span>
            </div>
          </div>
          <button
            class="btn-primary checkout-btn"
            (click)="confirmPayment()"
            [disabled]="processing() || !isFormValid()"
            type="button"
          >
            @if (processing()) {
              <span class="spinner" aria-hidden="true"></span>
              <span aria-live="polite">Processando...</span>
            } @else {
              Confirmar pagamento
            }
          </button>
        }

        @if (step() === "confirmed") {
          <div class="confirmed-block">
            <div class="confirmed-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h2 class="confirmed-title">Compra confirmada!</h2>
            <p class="confirmed-sub">
              Seu ingresso está disponível na sua conta
            </p>
            <div
              class="ticket-preview"
              role="article"
              aria-label="Ingresso confirmado"
            >
              <p class="tp-label">OVERGROUND · INGRESSO</p>
              <p class="tp-name">{{ event()!.name }}</p>
              <p class="tp-detail">
                {{ event()!.date | date: "dd MMM yyyy" : "" : "pt-BR" }} ·
                {{ ticketType() | uppercase }}
              </p>
              <div class="tp-divider" aria-hidden="true"></div>
              <img
                [src]="
                  'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=OVERGROUND-' +
                  confirmedId()
                "
                alt="QR Code do ingresso"
                class="tp-qr"
              />
              <p class="tp-id">ID: {{ confirmedId() }}</p>
            </div>
            <a
              routerLink="/account"
              class="btn-primary"
              style="width:100%;justify-content:center"
              >Ver meus ingressos</a
            >
            <a
              routerLink="/"
              class="btn-outline"
              style="width:100%;justify-content:center;margin-top:10px"
              >Voltar ao início</a
            >
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      .checkout-page {
        padding: 20px;
        animation: fadeIn 0.4s ease;
      }
      .checkout-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
      }
      .back-btn {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-primary);
        flex-shrink: 0;
      }
      .back-btn:hover {
        border-color: var(--accent);
        color: var(--accent-bright);
      }
      .back-btn:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .checkout-title {
        font-family: var(--font-display);
        font-size: 1rem;
        font-weight: 700;
        flex: 1;
      }
      .step-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .step {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        font-weight: 700;
        border: 1px solid var(--border);
        color: var(--text-muted);
        background: var(--bg-card);
      }
      .step.active {
        border-color: var(--accent);
        color: var(--accent-bright);
        background: rgba(124, 58, 237, 0.15);
      }
      .step.done {
        border-color: var(--success);
        color: var(--success);
        background: rgba(16, 185, 129, 0.1);
      }
      .step-line {
        width: 16px;
        height: 1px;
        background: var(--border);
      }
      .event-summary-card {
        display: flex;
        gap: 12px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 12px;
        margin-bottom: 24px;
      }
      .summary-img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 8px;
        flex-shrink: 0;
      }
      .summary-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 3px;
      }
      .summary-name {
        font-family: var(--font-display);
        font-size: 0.9rem;
        font-weight: 700;
      }
      .summary-date,
      .summary-venue {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--text-muted);
        letter-spacing: 0.04em;
      }
      .section-block {
        margin-bottom: 20px;
      }
      .block-title {
        font-family: var(--font-display);
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--accent-bright);
        margin-bottom: 14px;
      }
      .ticket-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
      }
      .ticket-option {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .ticket-option:hover {
        border-color: var(--accent);
      }
      .ticket-option:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .ticket-option.selected {
        border-color: var(--accent);
        background: rgba(124, 58, 237, 0.08);
      }
      .ticket-option.vip-option.selected {
        border-color: rgba(168, 85, 247, 0.5);
        background: rgba(168, 85, 247, 0.08);
      }
      .ticket-radio {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid var(--border);
        flex-shrink: 0;
        transition: all 0.2s;
        position: relative;
      }
      .ticket-radio.active {
        border-color: var(--accent);
        background: var(--accent);
        box-shadow: 0 0 10px var(--accent-glow);
      }
      .ticket-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .ticket-name {
        font-family: var(--font-display);
        font-size: 0.9rem;
        font-weight: 700;
      }
      .ticket-desc {
        font-size: 0.75rem;
        color: var(--text-muted);
      }
      .vip-tag {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--accent-bright);
        letter-spacing: 0.06em;
      }
      .ticket-price {
        font-family: var(--font-display);
        font-size: 0.95rem;
        font-weight: 800;
        color: var(--accent-bright);
      }
      .qty-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .qty-label {
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
      .qty-controls {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .qty-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid var(--border);
        background: var(--bg-card);
        color: var(--text-primary);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      .qty-btn:hover:not(:disabled) {
        border-color: var(--accent);
        color: var(--accent-bright);
      }
      .qty-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .qty-btn:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .qty-val {
        font-family: var(--font-display);
        font-size: 1.1rem;
        font-weight: 700;
        min-width: 20px;
        text-align: center;
      }
      .order-summary {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .order-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
      .order-row.total {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1rem;
        color: var(--text-primary);
      }
      .order-divider {
        height: 1px;
        background: var(--border);
      }
      .checkout-btn {
        width: 100%;
        justify-content: center;
        padding: 16px;
        font-size: 0.95rem;
      }
      .checkout-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .payment-methods {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }
      .pm-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 14px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--text-secondary);
        font-family: var(--font-display);
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }
      .pm-btn:hover:not(.active) {
        border-color: var(--accent);
      }
      .pm-btn.active {
        border-color: var(--accent);
        color: var(--accent-bright);
        background: rgba(124, 58, 237, 0.1);
      }
      .pm-btn:focus {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
      .card-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .form-row {
        display: flex;
        gap: 12px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      }
      .form-group label {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--text-muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .form-group input {
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 12px 14px;
        color: var(--text-primary);
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;
      }
      .form-group input:focus {
        border-color: var(--accent);
      }
      .form-group input.ng-invalid.ng-touched {
        border-color: var(--error);
      }
      .form-error {
        color: var(--error);
        font-size: 0.75rem;
        margin-top: 4px;
      }
      .pix-info {
        display: flex;
        justify-content: center;
      }
      .pix-qr {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .pix-qr-mock {
        width: 140px;
        height: 140px;
        background: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
      }
      .pix-qr-mock svg {
        width: 100%;
        height: 100%;
        color: #000;
      }
      .pix-val {
        font-family: var(--font-display);
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--accent-bright);
      }
      .pix-hint {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-align: center;
      }
      .confirmed-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 20px 0;
        animation: slideUp 0.5s ease;
      }
      .confirmed-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: rgba(16, 185, 129, 0.15);
        border: 2px solid var(--success);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--success);
      }
      .confirmed-icon svg {
        width: 32px;
        height: 32px;
      }
      .confirmed-title {
        font-family: var(--font-display);
        font-size: 1.4rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .confirmed-sub {
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
      .ticket-preview {
        width: 100%;
        background: var(--bg-card);
        border: 1px solid rgba(124, 58, 237, 0.25);
        border-radius: var(--radius-lg);
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      .tp-label {
        font-family: var(--font-mono);
        font-size: 0.6rem;
        color: var(--accent-bright);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .tp-name {
        font-family: var(--font-display);
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
      }
      .tp-detail {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .tp-divider {
        width: 100%;
        height: 1px;
        background: var(--border);
        margin: 4px 0;
      }
      .tp-qr {
        border-radius: 8px;
      }
      .tp-id {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--text-muted);
        letter-spacing: 0.1em;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      :host {
        display: block;
      }
    `,
  ],
})
export class CheckoutComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventSvc = inject(EventsService);
  private readonly ticketSvc = inject(TicketsService);
  private readonly authSvc = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  // Limites expostos ao template
  readonly MIN_TICKETS = 1;
  readonly MAX_TICKETS = 10;

  // Signals for reactive state
  readonly event = signal<Event | undefined>(undefined);
  readonly step = signal<Step>("select");
  readonly ticketType = signal<TicketType>("standard");
  readonly qty = signal<number>(this.MIN_TICKETS);
  readonly payMethod = signal<PaymentMethod>("pix");
  readonly processing = signal<boolean>(false);
  readonly confirmedId = signal<string>("");
  readonly submitted = signal<boolean>(false);

  // Card form fields (template-driven with FormsModule)
  cardNum = "";
  cardExp = "";
  cardCvv = "";
  cardName = "";

  get currentStepNumber(): number {
    const s = this.step();
    return s === "select" ? 1 : s === "payment" ? 2 : 3;
  }

  readonly totalPrice = computed(() => {
    const evt = this.event();
    if (!evt) return 0;
    const base =
      this.ticketType() === "vip"
        ? (evt.priceVip ?? evt.price ?? 0)
        : (evt.price ?? 0);
    return base * this.qty();
  });

  readonly fee = computed(() => Math.round(this.totalPrice() * 0.05));
  readonly totalWithFee = computed(() => this.totalPrice() + this.fee());

  ngOnInit() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        const event = this.eventSvc.getById(params["id"]);
        if (event) {
          this.event.set(event);
        } else {
          this.router.navigate(["/events"]);
        }
      },
      error: () => this.router.navigate(["/events"]),
    });
  }

  back(): void {
    const currentStep = this.step();
    if (currentStep === "payment") {
      this.step.set("select");
    } else {
      const eventId = this.event()?.id;
      this.router.navigate(eventId ? ["/events", eventId] : ["/events"]);
    }
  }

  setTicketType(type: TicketType): void {
    this.ticketType.set(type);
  }

  incrementQty(): void {
    if (this.qty() < this.MAX_TICKETS) {
      this.qty.update((q) => q + 1);
    }
  }

  decrementQty(): void {
    if (this.qty() > this.MIN_TICKETS) {
      this.qty.update((q) => q - 1);
    }
  }

  setPayMethod(method: PaymentMethod): void {
    this.payMethod.set(method);
  }

  goToPayment(): void {
    if (!this.authSvc.isLoggedIn()) {
      this.router.navigate(["/account"], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    this.step.set("payment");
  }

  formatCardNumber(): void {
    let value = this.cardNum.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();
    this.cardNum = value;
  }

  formatExpiry(): void {
    let value = this.cardExp.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    this.cardExp = value;
  }

  formatCardName(): void {
    this.cardName = this.cardName.toUpperCase().slice(0, 50);
  }

  isCardFormValid(): boolean {
    const num = this.cardNum.replace(/\s/g, "");
    const exp = this.cardExp;
    const cvv = this.cardCvv;

    return (
      num.length === 16 &&
      /^\d{2}\/\d{2}$/.test(exp) &&
      /^\d{3,4}$/.test(cvv) &&
      this.cardName.trim().length >= 3
    );
  }

  isFormValid(): boolean {
    if (this.payMethod() === "pix") return true;
    return this.isCardFormValid();
  }

  async confirmPayment(): Promise<void> {
    if (this.payMethod() === "card" && !this.isCardFormValid()) {
      this.submitted.set(true);
      return;
    }

    this.processing.set(true);
    this.submitted.set(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const evt = this.event();
      if (!evt) throw new Error("Evento não encontrado");

      const ticket = this.ticketSvc.purchase(
        {
          eventId: evt.id,
          eventName: evt.name,
          eventDate: evt.date,
          eventVenue: evt.venue,
          type: this.ticketType(),
          price: this.totalWithFee(),
          status: "confirmed",
        },
        {
          eventName: evt.name,
          amount: this.totalWithFee(),
          date: new Date().toISOString(),
          status: "paid",
          method: this.payMethod() === "pix" ? "PIX" : "Cartão de crédito",
        },
      );

      this.confirmedId.set(ticket.id);
      this.step.set("confirmed");
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Não foi possível processar seu pagamento. Tente novamente.");
    } finally {
      this.processing.set(false);
    }
  }
}
