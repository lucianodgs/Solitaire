import React, { useEffect, useState } from 'react';
import type { Card as CardType } from '@/types/game';
import { SUIT_SYMBOLS } from '@/types/game';

interface WinAnimationProps {
  foundations: CardType[][];
  onComplete: () => void;
}

interface AnimatedCard {
  id: string;
  card: CardType;
  x: number;
  y: number;
  delay: number;
  rotation: number;
}

const WinAnimation: React.FC<WinAnimationProps> = ({ foundations, onComplete }) => {
  const [animatedCards, setAnimatedCards] = useState<AnimatedCard[]>([]);

  useEffect(() => {
    const cards: AnimatedCard[] = [];
    let delay = 0;

    for (let foundationIndex = 0; foundationIndex < 4; foundationIndex++) {
      const foundation = foundations[foundationIndex];
      for (let cardIndex = foundation.length - 1; cardIndex >= 0; cardIndex--) {
        const card = foundation[cardIndex];
        cards.push({
          id: `anim-${card.id}`,
          card,
          x: 200 + foundationIndex * 90,
          y: 50,
          delay,
          rotation: Math.random() * 360,
        });
        delay += 50;
      }
    }

    setAnimatedCards(cards);

    const timer = setTimeout(() => {
      onComplete();
    }, delay + 1500);

    return () => clearTimeout(timer);
  }, [foundations, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {animatedCards.map((animCard) => (
        <AnimatedCardComponent
          key={animCard.id}
          card={animCard.card}
          startX={animCard.x}
          startY={animCard.y}
          delay={animCard.delay}
          rotation={animCard.rotation}
        />
      ))}
    </div>
  );
};

interface AnimatedCardComponentProps {
  card: CardType;
  startX: number;
  startY: number;
  delay: number;
  rotation: number;
}

const AnimatedCardComponent: React.FC<AnimatedCardComponentProps> = ({
  card,
  startX,
  startY,
  delay,
  rotation,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const isRed = card.color === 'red';
  const color = isRed ? '#ff0000' : '#000000';
  const suitSymbol = SUIT_SYMBOLS[card.suit];

  return (
    <div
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: '71px',
        height: '96px',
        backgroundColor: '#ffffff',
        border: '1px solid #000000',
        borderRadius: '4px',
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animation: isAnimating ? `cardBounce 800ms ease-out forwards` : 'none',
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? undefined : 'scale(0)',
        zIndex: 1000,
      }}
    >
      <style>{`
        @keyframes cardBounce {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          30% {
            transform: translateY(-150px) rotate(${rotation * 0.5}deg) scale(1.1);
          }
          60% {
            transform: translateY(50px) rotate(${rotation * 0.8}deg) scale(1);
          }
          100% {
            transform: translateY(${window.innerHeight - startY + 100}px) rotate(${rotation}deg) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>

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
        <span style={{ fontSize: '12px', color, lineHeight: '1' }}>{suitSymbol}</span>
      </div>

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
        <span style={{ fontSize: '12px', color, lineHeight: '1' }}>{suitSymbol}</span>
      </div>
    </div>
  );
};

export default WinAnimation;
