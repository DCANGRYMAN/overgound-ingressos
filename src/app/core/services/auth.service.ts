import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this.loadUser());
  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this._user());

  login(email: string, password: string): boolean {
    if (email && password.length >= 4) {
      const user: User = {
        id: '1',
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${email}&backgroundColor=7c3aed`
      };
      this._user.set(user);
      localStorage.setItem('og_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('og_user');
  }

  private loadUser(): User | null {
    try { return JSON.parse(localStorage.getItem('og_user') || 'null'); } catch { return null; }
  }
}
