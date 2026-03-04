export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  color: 'red' | 'black';
}

export interface Pile {
  id: string;
  cards: Card[];
  type: 'stock' | 'waste' | 'foundation' | 'tableau';
  suit?: Suit;
}

export interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  score: number;
  moves: number;
  time: number;
  gameWon: boolean;
  drawMode: 1 | 3;
}

export interface DragItem {
  card: Card;
  sourcePile: string;
  sourceIndex: number;
  cards: Card[];
}

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const RANK_VALUES: Record<Rank, number> = {
  A: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
};
