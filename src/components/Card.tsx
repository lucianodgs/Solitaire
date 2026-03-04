import React from 'react';
import type { Card as CardType } from '@/types/game';
import { SUIT_SYMBOLS } from '@/types/game';

interface CardProps {
  card: CardType;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, card: CardType) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onClick?: () => void;
  onDoubleClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  card,
  draggable = false,
  onDragStart,
  onDragEnd,
  onClick,
  onDoubleClick,
  style,
  className = '',
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, card);
    }
  };

  if (!card.faceUp) {
    return (
      <div
        className={`card-face-down ${className}`}
        style={{
          width: '71px',
          height: '96px',
          backgroundColor: '#000080',
          border: '1px solid #000000',
          borderRadius: '4px',
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 4px,
              #0000a0 4px,
              #0000a0 8px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 4px,
              #0000a0 4px,
              #0000a0 8px
            )
          `,
          boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          ...style,
        }}
        onClick={onClick}
      />
    );
  }

  const isRed = card.color === 'red';
  const color = isRed ? '#ff0000' : '#000000';
  const suitSymbol = SUIT_SYMBOLS[card.suit];

  return (
    <div
      className={`card-face-up ${className}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        width: '71px',
        height: '96px',
        backgroundColor: '#ffffff',
        border: '1px solid #000000',
        borderRadius: '4px',
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: draggable ? 'grab' : 'pointer',
        boxShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Top-left corner */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color,
            lineHeight: '1',
            fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
          }}
        >
          {card.rank}
        </span>
        <span
          style={{
            fontSize: '12px',
            color,
            lineHeight: '1',
          }}
        >
          {suitSymbol}
        </span>
      </div>

      {/* Center symbol */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '32px',
          color,
          lineHeight: '1',
        }}
      >
        {suitSymbol}
      </div>

      {/* Bottom-right corner (inverted) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          transform: 'rotate(180deg)',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color,
            lineHeight: '1',
            fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
          }}
        >
          {card.rank}
        </span>
        <span
          style={{
            fontSize: '12px',
            color,
            lineHeight: '1',
          }}
        >
          {suitSymbol}
        </span>
      </div>
    </div>
  );
};

export default Card;
