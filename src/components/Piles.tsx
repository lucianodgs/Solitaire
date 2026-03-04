import React from 'react';
import type { Card as CardType } from '@/types/game';
import Card from './Card';

interface StockPileProps {
  cards: CardType[];
  onClick: () => void;
}

export const StockPile: React.FC<StockPileProps> = ({ cards, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '71px',
        height: '96px',
        border: cards.length === 0 ? '2px dashed #808080' : 'none',
        borderRadius: '4px',
        cursor: cards.length === 0 ? 'default' : 'pointer',
        position: 'relative',
      }}
    >
      {cards.length > 0 && (
        <Card
          card={{ ...cards[cards.length - 1], faceUp: false }}
          onClick={onClick}
        />
      )}
      {cards.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            width: '71px',
            height: '96px',
            backgroundColor: '#000080',
            border: '1px solid #000000',
            borderRadius: '4px',
            zIndex: -1,
          }}
        />
      )}
    </div>
  );
};

interface WastePileProps {
  cards: CardType[];
  onCardClick?: () => void;
  onCardDoubleClick?: () => void;
  onDragStart?: (e: React.DragEvent, card: CardType) => void;
}

export const WastePile: React.FC<WastePileProps> = ({
  cards,
  onCardClick,
  onCardDoubleClick,
  onDragStart,
}) => {
  const topCard = cards.length > 0 ? cards[0] : null;

  return (
    <div
      style={{
        width: '71px',
        height: '96px',
        border: '2px dashed #808080',
        borderRadius: '4px',
        position: 'relative',
      }}
    >
      {topCard && (
        <Card
          card={topCard}
          draggable
          onDragStart={onDragStart}
          onClick={onCardClick}
          onDoubleClick={onCardDoubleClick}
        />
      )}
      {cards.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            zIndex: -1,
          }}
        >
          <Card
            card={{ ...cards[1], faceUp: true }}
            style={{ opacity: 0.7 }}
          />
        </div>
      )}
      {cards.length > 2 && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: -8,
            zIndex: -2,
          }}
        >
          <Card
            card={{ ...cards[2], faceUp: true }}
            style={{ opacity: 0.5 }}
          />
        </div>
      )}
    </div>
  );
};

interface FoundationPileProps {
  cards: CardType[];
  suitIndex: number;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  isDragOver?: boolean;
}

const SUIT_SYMBOLS = ['♥', '♦', '♣', '♠'];
const SUIT_COLORS = ['#ff0000', '#ff0000', '#000000', '#000000'];

export const FoundationPile: React.FC<FoundationPileProps> = ({
  cards,
  suitIndex,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver = false,
}) => {
  const topCard = cards.length > 0 ? cards[cards.length - 1] : null;
  const suitSymbol = SUIT_SYMBOLS[suitIndex];
  const suitColor = SUIT_COLORS[suitIndex];

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        width: '71px',
        height: '96px',
        border: isDragOver ? '2px solid #ffff00' : '2px dashed #808080',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDragOver ? 'rgba(255,255,0,0.1)' : 'transparent',
        position: 'relative',
      }}
    >
      {!topCard && (
        <span
          style={{
            fontSize: '36px',
            color: suitColor,
            opacity: 0.3,
          }}
        >
          {suitSymbol}
        </span>
      )}
      {topCard && (
        <Card
          card={topCard}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('sourcePile', `foundation-${suitIndex}`);
            e.dataTransfer.setData('sourceIndex', '0');
          }}
        />
      )}
    </div>
  );
};

interface TableauPileProps {
  cards: CardType[];
  pileIndex: number;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onCardDragStart?: (e: React.DragEvent, card: CardType, cardIndex: number) => void;
  onCardDoubleClick?: (cardIndex: number) => void;
  isDragOver?: boolean;
}

export const TableauPile: React.FC<TableauPileProps> = ({
  cards,
  onDrop,
  onDragOver,
  onDragLeave,
  onCardDragStart,
  onCardDoubleClick,
  isDragOver = false,
}) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        width: '71px',
        minHeight: '96px',
        border: isDragOver ? '2px solid #ffff00' : cards.length === 0 ? '2px dashed #808080' : 'none',
        borderRadius: '4px',
        backgroundColor: isDragOver ? 'rgba(255,255,0,0.1)' : 'transparent',
        position: 'relative',
      }}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          style={{
            position: 'absolute',
            top: index * 20,
            left: 0,
            zIndex: index,
          }}
        >
          <Card
            card={card}
            draggable={card.faceUp}
            onDragStart={(e, c) => onCardDragStart?.(e, c, index)}
            onDoubleClick={() => onCardDoubleClick?.(index)}
          />
        </div>
      ))}
    </div>
  );
};
