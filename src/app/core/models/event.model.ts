export type EventCategory = 'conferencia' | 'feira' | 'exposicao' | 'festival';

export interface Event {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: EventCategory;
  date: string;
  dateEnd?: string;
  time: string;
  city: string;
  state: string;
  venue: string;
  address: string;
  price: number;
  priceVip?: number;
  image: string;
  featured: boolean;
  tags: string[];
  capacity: number;
  availableTickets: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  type: 'standard' | 'vip';
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  purchaseDate: string;
  qrCode: string;
}

export interface Payment {
  id: string;
  ticketId: string;
  eventName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  method: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
