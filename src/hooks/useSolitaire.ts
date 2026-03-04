import { useState, useCallback, useEffect, useRef } from 'react';
import type { Card, Suit, Rank, GameState } from '@/types/game';
import { RANK_VALUES } from '@/types/game';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `card-${id++}`,
        suit,
        rank,
        faceUp: false,
        color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
      });
    }
  }
  
  return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function dealCards(deck: Card[]): { stock: Card[]; tableau: Card[][] } {
  const stock = [...deck];
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = stock.pop()!;
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }
  
  return { stock, tableau };
}

function canMoveToTableau(card: Card, targetCard: Card | null): boolean {
  if (!targetCard) {
    return card.rank === 'K';
  }
  
  const cardValue = RANK_VALUES[card.rank];
  const targetValue = RANK_VALUES[targetCard.rank];
  
  return cardValue === targetValue - 1 && card.color !== targetCard.color;
}

function canMoveToFoundation(card: Card, targetCard: Card | null, suit: Suit): boolean {
  if (card.suit !== suit) return false;
  
  if (!targetCard) {
    return card.rank === 'A';
  }
  
  const cardValue = RANK_VALUES[card.rank];
  const targetValue = RANK_VALUES[targetCard.rank];
  
  return cardValue === targetValue + 1;
}

export function useSolitaire() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = createDeck();
    const { stock, tableau } = dealCards(deck);
    
    return {
      stock,
      waste: [],
      foundations: [[], [], [], []],
      tableau,
      score: 0,
      moves: 0,
      time: 0,
      gameWon: false,
      drawMode: 1,
    };
  });
  
  const [winAnimation, setWinAnimation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!gameState.gameWon && !winAnimation) {
      timerRef.current = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameWon, winAnimation]);

  const checkWin = useCallback((foundations: Card[][]): boolean => {
    return foundations.every(foundation => foundation.length === 13);
  }, []);

  const dealFromStock = useCallback(() => {
    setGameState(prev => {
      if (prev.stock.length === 0) {
        if (prev.waste.length === 0) return prev;
        
        return {
          ...prev,
          stock: prev.waste.map(c => ({ ...c, faceUp: false })).reverse(),
          waste: [],
          moves: prev.moves + 1,
        };
      }
      
      const drawCount = Math.min(prev.drawMode, prev.stock.length);
      const drawnCards: Card[] = [];
      
      for (let i = 0; i < drawCount; i++) {
        const card = prev.stock[prev.stock.length - 1 - i];
        drawnCards.push({ ...card, faceUp: true });
      }
      
      const newStock = prev.stock.slice(0, prev.stock.length - drawCount);
      const newWaste = [...drawnCards.reverse(), ...prev.waste];
      
      return {
        ...prev,
        stock: newStock,
        waste: newWaste,
        moves: prev.moves + 1,
      };
    });
  }, []);

  const moveCard = useCallback((
    sourcePile: string,
    sourceIndex: number,
    targetPile: string,
    _targetIndex?: number
  ): boolean => {
    let success = false;
    
    setGameState(prev => {
      const newState = { ...prev };
      
      let sourceCards: Card[] = [];
      let sourceArray: Card[] | null = null;
      let sourcePileIndex = -1;
      
      if (sourcePile === 'waste') {
        sourceArray = newState.waste;
        sourceCards = [newState.waste[newState.waste.length - 1]];
      } else if (sourcePile.startsWith('tableau-')) {
        sourcePileIndex = parseInt(sourcePile.split('-')[1]);
        sourceArray = newState.tableau[sourcePileIndex];
        sourceCards = sourceArray.slice(sourceIndex);
      } else if (sourcePile.startsWith('foundation-')) {
        sourcePileIndex = parseInt(sourcePile.split('-')[1]);
        sourceArray = newState.foundations[sourcePileIndex];
        sourceCards = [sourceArray[sourceArray.length - 1]];
      }
      
      if (!sourceArray || sourceCards.length === 0) {
        return prev;
      }
      
      const card = sourceCards[0];
      let canMove = false;
      
      if (targetPile.startsWith('foundation-')) {
        const foundationIndex = parseInt(targetPile.split('-')[1]);
        const foundation = newState.foundations[foundationIndex];
        const targetCard = foundation.length > 0 ? foundation[foundation.length - 1] : null;
        const suit = SUITS[foundationIndex];
        
        if (sourceCards.length === 1 && canMoveToFoundation(card, targetCard, suit)) {
          canMove = true;
          newState.foundations[foundationIndex] = [...foundation, card];
        }
      } else if (targetPile.startsWith('tableau-')) {
        const tableauIndex = parseInt(targetPile.split('-')[1]);
        const tableau = newState.tableau[tableauIndex];
        const targetCard = tableau.length > 0 ? tableau[tableau.length - 1] : null;
        
        if (canMoveToTableau(card, targetCard)) {
          canMove = true;
          newState.tableau[tableauIndex] = [...tableau, ...sourceCards];
        }
      }
      
      if (canMove) {
        success = true;
        
        if (sourcePile === 'waste') {
          newState.waste = newState.waste.slice(0, -1);
        } else if (sourcePile.startsWith('tableau-')) {
          newState.tableau[sourcePileIndex] = sourceArray.slice(0, sourceIndex);
          const newPile = newState.tableau[sourcePileIndex];
          if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
            newPile[newPile.length - 1].faceUp = true;
            newState.score += 5;
          }
        } else if (sourcePile.startsWith('foundation-')) {
          newState.foundations[sourcePileIndex] = sourceArray.slice(0, -1);
        }
        
        newState.moves += 1;
        
        if (targetPile.startsWith('foundation-')) {
          newState.score += 10;
        }
        
        const won = checkWin(newState.foundations);
        newState.gameWon = won;
        
        if (won) {
          setWinAnimation(true);
        }
      }
      
      return canMove ? newState : prev;
    });
    
    return success;
  }, [checkWin]);

  const autoMoveToFoundation = useCallback((sourcePile: string, _sourceIndex: number = 0): boolean => {
    let moved = false;
    
    setGameState(prev => {
      const newState = { ...prev };
      let card: Card | null = null;
      
      if (sourcePile === 'waste' && newState.waste.length > 0) {
        card = newState.waste[newState.waste.length - 1];
      } else if (sourcePile.startsWith('tableau-')) {
        const pileIndex = parseInt(sourcePile.split('-')[1]);
        const pile = newState.tableau[pileIndex];
        if (pile.length > 0) {
          card = pile[pile.length - 1];
        }
      }
      
      if (!card) return prev;
      
      const suitIndex = SUITS.indexOf(card.suit);
      const foundation = newState.foundations[suitIndex];
      const targetCard = foundation.length > 0 ? foundation[foundation.length - 1] : null;
      
      if (canMoveToFoundation(card, targetCard, card.suit)) {
        moved = true;
        newState.foundations[suitIndex] = [...foundation, card];
        
        if (sourcePile === 'waste') {
          newState.waste = newState.waste.slice(0, -1);
        } else if (sourcePile.startsWith('tableau-')) {
          const pileIndex = parseInt(sourcePile.split('-')[1]);
          newState.tableau[pileIndex] = newState.tableau[pileIndex].slice(0, -1);
          const newPile = newState.tableau[pileIndex];
          if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
            newPile[newPile.length - 1].faceUp = true;
            newState.score += 5;
          }
        }
        
        newState.moves += 1;
        newState.score += 10;
        
        const won = checkWin(newState.foundations);
        newState.gameWon = won;
        
        if (won) {
          setWinAnimation(true);
        }
      }
      
      return moved ? newState : prev;
    });
    
    return moved;
  }, [checkWin]);

  const newGame = useCallback(() => {
    const deck = createDeck();
    const { stock, tableau } = dealCards(deck);
    
    setWinAnimation(false);
    setGameState({
      stock,
      waste: [],
      foundations: [[], [], [], []],
      tableau,
      score: 0,
      moves: 0,
      time: 0,
      gameWon: false,
      drawMode: 1,
    });
  }, []);

  const setDrawMode = useCallback((mode: 1 | 3) => {
    setGameState(prev => ({ ...prev, drawMode: mode }));
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    gameState,
    winAnimation,
    dealFromStock,
    moveCard,
    autoMoveToFoundation,
    newGame,
    setDrawMode,
    formatTime,
  };
}
