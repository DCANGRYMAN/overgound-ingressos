import { Injectable, signal, computed } from '@angular/core';
import { Event, EventCategory } from '../models/event.model';

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Futurecom 2025',
    description: 'Maior congresso de telecomunicações e TI da América Latina.',
    longDescription: 'O Futurecom é o maior congresso e exposição de telecomunicações, TI e negócios digitais da América Latina. Com mais de 25 anos de história, o evento reúne líderes do setor, inovadores e decisores de compras das maiores empresas do Brasil e do mundo. São mais de 300 expositores, 200 palestrantes e 15.000 participantes em uma experiência imersiva de 4 dias.',
    category: 'conferencia',
    date: '2025-10-07',
    dateEnd: '2025-10-10',
    time: '09:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'Transamerica Expo Center',
    address: 'Av. Dr. Mário Vilas Boas Rodrigues, 387 - Santo Amaro',
    price: 890,
    priceVip: 2200,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    featured: true,
    tags: ['telecom', 'TI', 'digital', '5G'],
    capacity: 15000,
    availableTickets: 4200
  },
  {
    id: '2',
    name: 'CPBR – Campus Party Brasil',
    description: 'O maior festival de tecnologia, ciência, cultura e empreendedorismo do mundo.',
    longDescription: 'A Campus Party Brasil é considerado o maior festival de tecnologia do mundo. Durante dias e noites ininterruptas, milhares de participantes se reúnem para hackathons, palestras, competições e muito networking. Um evento que transcende a tecnologia e celebra a cultura maker, a inovação e a criatividade em todas as suas formas.',
    category: 'festival',
    date: '2025-07-30',
    dateEnd: '2025-08-03',
    time: '10:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'São Paulo Expo',
    address: 'Rod. dos Imigrantes, km 1,5 - Vila Água Funda',
    price: 550,
    priceVip: 1400,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    featured: true,
    tags: ['tecnologia', 'hacking', 'maker', 'inovação'],
    capacity: 20000,
    availableTickets: 6800
  },
  {
    id: '3',
    name: 'Mind The Sec',
    description: 'Conferência premium de cibersegurança para líderes e especialistas.',
    longDescription: 'O Mind The Sec é a principal conferência de cibersegurança do Brasil, reunindo os maiores especialistas nacionais e internacionais. O evento é voltado para CISOs, gestores de segurança e profissionais que buscam se atualizar nas últimas tendências de proteção cibernética, inteligência de ameaças e segurança em nuvem.',
    category: 'conferencia',
    date: '2025-09-11',
    dateEnd: '2025-09-12',
    time: '08:30',
    city: 'São Paulo',
    state: 'SP',
    venue: 'WTC Events Center',
    address: 'Av. das Nações Unidas, 12.551 - Brooklin',
    price: 1200,
    priceVip: 3500,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    featured: true,
    tags: ['cybersecurity', 'CISO', 'cloud', 'AI Security'],
    capacity: 3000,
    availableTickets: 890
  },
  {
    id: '4',
    name: 'BIG Festival',
    description: 'Festival internacional de games da América Latina.',
    longDescription: 'O BIG Festival (Brazil\'s Independent Games Festival) é o maior festival de jogos independentes da América Latina. O evento celebra o desenvolvimento de games com exposições, competições, palestras com desenvolvedores renomados e sessões de networking entre publishers e estúdios de todo o mundo.',
    category: 'festival',
    date: '2025-06-24',
    dateEnd: '2025-06-28',
    time: '11:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'São Paulo Expo',
    address: 'Rod. dos Imigrantes, km 1,5 - Vila Água Funda',
    price: 320,
    priceVip: 980,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    featured: false,
    tags: ['games', 'indie', 'desenvolvedores', 'e-sports'],
    capacity: 12000,
    availableTickets: 3100
  },
  {
    id: '5',
    name: 'Expo Eletrônica São Paulo',
    description: 'A maior feira de componentes eletrônicos e equipamentos do Brasil.',
    longDescription: 'A Expo Eletrônica São Paulo é referência nacional para profissionais da indústria eletrônica. Com centenas de expositores de componentes, equipamentos de teste, sistemas embarcados e soluções de automação, o evento é essencial para engenheiros, projetistas e compradores do setor industrial e de consumo.',
    category: 'feira',
    date: '2025-08-19',
    dateEnd: '2025-08-22',
    time: '10:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'Expo Center Norte',
    address: 'R. José Bernardo Pinto, 333 - Vila Guilherme',
    price: 180,
    priceVip: 650,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    featured: false,
    tags: ['componentes', 'embarcados', 'automação', 'IoT'],
    capacity: 8000,
    availableTickets: 2400
  },
  {
    id: '6',
    name: 'Inteligência Artificial Summit BR',
    description: 'O maior evento de IA do Brasil com foco em aplicações enterprise.',
    longDescription: 'O AI Summit Brasil reúne os principais nomes da inteligência artificial aplicada a negócios. Com tracks sobre machine learning, LLMs, AI generativa, MLOps e ética em IA, o evento é destinado a CTOs, engenheiros de dados e líderes de inovação que buscam implementar soluções de IA em escala.',
    category: 'conferencia',
    date: '2025-11-18',
    dateEnd: '2025-11-19',
    time: '09:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'Centro de Convenções Frei Caneca',
    address: 'R. Frei Caneca, 569 - Consolação',
    price: 1500,
    priceVip: 4200,
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    featured: true,
    tags: ['AI', 'machine learning', 'LLM', 'enterprise'],
    capacity: 4000,
    availableTickets: 1200
  },
  {
    id: '7',
    name: 'Maker Faire São Paulo',
    description: 'Festival de invenção, criatividade e tecnologia maker.',
    longDescription: 'A Maker Faire São Paulo é parte do movimento mundial que celebra a cultura maker. Robótica, impressão 3D, eletrônica DIY, arte digital e projetos de código aberto tomam conta do espaço em um espetáculo de criatividade e inovação aberta. O evento atrai desde amadores apaixonados até startups de hardware.',
    category: 'feira',
    date: '2025-05-17',
    dateEnd: '2025-05-18',
    time: '10:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'SESC Pompeia',
    address: 'R. Clélia, 93 - Pompeia',
    price: 120,
    priceVip: 380,
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80',
    featured: false,
    tags: ['maker', 'hardware', 'robótica', 'DIY'],
    capacity: 5000,
    availableTickets: 1800
  },
  {
    id: '8',
    name: 'Blockchain & Web3 Brazil',
    description: 'Conferência sobre tecnologias descentralizadas e o futuro digital.',
    longDescription: 'O Blockchain & Web3 Brazil conecta founders de protocolo, investidores institucionais, desenvolvedores e reguladores para discutir o futuro da infraestrutura digital descentralizada. Tracks sobre DeFi, NFTs, tokenização de ativos reais, regulação cripto e infraestrutura blockchain para empresas.',
    category: 'conferencia',
    date: '2025-10-21',
    dateEnd: '2025-10-22',
    time: '09:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'Blue Tree Premium Paulista',
    address: 'Av. Paulista, 2300 - Bela Vista',
    price: 780,
    priceVip: 2800,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    featured: false,
    tags: ['blockchain', 'web3', 'DeFi', 'crypto'],
    capacity: 2500,
    availableTickets: 760
  },
  {
    id: '9',
    name: 'Exposição Nacional de Robótica',
    description: 'A maior mostra de robótica industrial e autônoma da América do Sul.',
    longDescription: 'A Exposição Nacional de Robótica traz ao público as mais avançadas soluções de automação industrial, robôs colaborativos (cobots), veículos autônomos e drones industriais. Com demonstrações ao vivo e competições de robótica, o evento é destaque para profissionais da indústria 4.0.',
    category: 'exposicao',
    date: '2025-09-02',
    dateEnd: '2025-09-05',
    time: '09:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'Pavilhão da Bienal',
    address: 'Av. Pedro Álvares Cabral - Ibirapuera',
    price: 290,
    priceVip: 890,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    featured: true,
    tags: ['robótica', 'automação', 'cobot', 'indústria 4.0'],
    capacity: 10000,
    availableTickets: 3500
  },
  {
    id: '10',
    name: 'Semana de Inovação Tecnológica SP',
    description: 'Uma semana dedicada às tecnologias emergentes e startups de impacto.',
    longDescription: 'A Semana de Inovação Tecnológica de São Paulo é uma iniciativa que reúne o ecossistema de startups, venture capital, grandes corporações e governo para debater e apresentar as tecnologias que moldarão o próximo decênio. Com mais de 100 eventos simultâneos distribuídos pela cidade, é a maior semana de inovação da América Latina.',
    category: 'exposicao',
    date: '2025-11-03',
    dateEnd: '2025-11-07',
    time: '08:00',
    city: 'São Paulo',
    state: 'SP',
    venue: 'Múltiplos locais - SP',
    address: 'São Paulo, SP',
    price: 450,
    priceVip: 1600,
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
    featured: false,
    tags: ['startups', 'inovação', 'VC', 'tech'],
    capacity: 25000,
    availableTickets: 9800
  },
  // Other regions
  {
    id: '11',
    name: 'Rio Innovation Week',
    description: 'O maior evento de inovação do Rio de Janeiro.',
    longDescription: 'O Rio Innovation Week transforma a cidade maravilhosa no palco da inovação brasileira. Com mais de 300 startups, painéis com líderes globais, demos de tecnologias emergentes e muito networking, o evento conecta o Rio com os maiores hubs de inovação do mundo. Uma experiência única com o pôr do sol carioca como pano de fundo.',
    category: 'conferencia',
    date: '2025-08-12',
    dateEnd: '2025-08-15',
    time: '09:00',
    city: 'Rio de Janeiro',
    state: 'RJ',
    venue: 'Riocentro Pavilhão 5',
    address: 'Av. Salvador Allende, 6555 - Barra da Tijuca',
    price: 620,
    priceVip: 1800,
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
    featured: true,
    tags: ['inovação', 'startups', 'Rio', 'tech'],
    capacity: 18000,
    availableTickets: 5400
  },
  {
    id: '12',
    name: 'TecnoShow Minas',
    description: 'Feira de tecnologia e automação industrial do centro-oeste brasileiro.',
    longDescription: 'A TecnoShow Minas é a principal feira de tecnologia industrial do estado de Minas Gerais, reunindo expositores dos setores de automação, eletrônica de potência, sistemas de controle e soluções para mineração inteligente. Um evento essencial para profissionais da cadeia produtiva mineira.',
    category: 'feira',
    date: '2025-06-10',
    dateEnd: '2025-06-13',
    time: '10:00',
    city: 'Belo Horizonte',
    state: 'MG',
    venue: 'Expominas',
    address: 'Av. Amazonas, 6200 - Gameleira',
    price: 220,
    priceVip: 680,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    featured: false,
    tags: ['automação', 'industrial', 'mineração', 'controle'],
    capacity: 7000,
    availableTickets: 2100
  },
  {
    id: '13',
    name: 'Expo Tech Sul',
    description: 'Festival de tecnologia e inovação do Sul do Brasil.',
    longDescription: 'A Expo Tech Sul é o principal evento de tecnologia da região Sul, reunindo o vibrante ecossistema de startups gaúcho e catarinense com o melhor da inovação nacional. Com foco em agtech, fintech e manufatura avançada, o evento reflete as forças econômicas únicas da região.',
    category: 'exposicao',
    date: '2025-10-14',
    dateEnd: '2025-10-16',
    time: '09:00',
    city: 'Porto Alegre',
    state: 'RS',
    venue: 'Centro de Eventos FIERGS',
    address: 'Av. Assis Brasil, 8787 - Sarandi',
    price: 380,
    priceVip: 1100,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    featured: false,
    tags: ['agtech', 'fintech', 'manufatura', 'sul'],
    capacity: 9000,
    availableTickets: 3200
  },
  {
    id: '14',
    name: 'Nordeste Digital Summit',
    description: 'A maior conferência de transformação digital do Nordeste.',
    longDescription: 'O Nordeste Digital Summit é a plataforma que conecta o poder econômico do nordeste brasileiro com a agenda global de transformação digital. Governo, empresas e startups locais debatem cidades inteligentes, inclusão digital, fintechs regionais e o papel da tecnologia no desenvolvimento sustentável.',
    category: 'conferencia',
    date: '2025-09-23',
    dateEnd: '2025-09-24',
    time: '08:30',
    city: 'Recife',
    state: 'PE',
    venue: 'Centro de Convenções de Pernambuco',
    address: 'Complexo Viário Gov. Mário Covas - Olinda',
    price: 480,
    priceVip: 1400,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    featured: false,
    tags: ['nordeste', 'smart cities', 'inclusão', 'fintech'],
    capacity: 5000,
    availableTickets: 1900
  },
  {
    id: '15',
    name: 'Amazônia Tech',
    description: 'Conferência de tecnologia verde e bioeconomia digital.',
    longDescription: 'O Amazônia Tech é um evento único no panorama global: une tecnologia de ponta com a pauta ambiental mais urgente do planeta. Startups de bioeconomia, soluções de monitoramento ambiental com IA e satélites, blockchain para rastreabilidade de cadeias produtivas sustentáveis e muito mais neste encontro singular em Manaus.',
    category: 'conferencia',
    date: '2025-11-25',
    dateEnd: '2025-11-26',
    time: '09:00',
    city: 'Manaus',
    state: 'AM',
    venue: 'Centro de Convenções Vasco Vasques',
    address: 'Av. Constantino Nery, 5001 - Flores',
    price: 560,
    priceVip: 1600,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    featured: false,
    tags: ['green tech', 'bioeconomia', 'sustentabilidade', 'amazônia'],
    capacity: 3000,
    availableTickets: 1400
  }
];

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly _events = signal<Event[]>(MOCK_EVENTS);
  private readonly _favorites = signal<string[]>(this.loadFavorites());
  private readonly _searchQuery = signal<string>('');
  private readonly _selectedState = signal<string>('');
  private readonly _selectedCategory = signal<EventCategory | ''>('');

  readonly events = computed(() => this._events());
  readonly favorites = computed(() => this._favorites());
  readonly searchQuery = computed(() => this._searchQuery());
  readonly selectedState = computed(() => this._selectedState());

  readonly filteredEvents = computed(() => {
    let list = this._events();
    const q = this._searchQuery().toLowerCase();
    const state = this._selectedState();
    const cat = this._selectedCategory();
    if (q) list = list.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.city.toLowerCase().includes(q));
    if (state) list = list.filter(e => e.state === state);
    if (cat) list = list.filter(e => e.category === cat);
    return list;
  });

  readonly featuredEvents = computed(() => this._events().filter(e => e.featured));

  getById(id: string): Event | undefined {
    return this._events().find(e => e.id === id);
  }

  isFavorite(id: string): boolean {
    return this._favorites().includes(id);
  }

  toggleFavorite(id: string): void {
    const current = this._favorites();
    const updated = current.includes(id) ? current.filter(f => f !== id) : [...current, id];
    this._favorites.set(updated);
    localStorage.setItem('og_favorites', JSON.stringify(updated));
  }

  setSearch(q: string) { this._searchQuery.set(q); }
  setState(s: string) { this._selectedState.set(s); }
  setCategory(c: EventCategory | '') { this._selectedCategory.set(c); }

  private loadFavorites(): string[] {
    try { return JSON.parse(localStorage.getItem('og_favorites') || '[]'); } catch { return []; }
  }

  getStates(): string[] {
    return [...new Set(this._events().map(e => e.state))].sort();
  }
}
