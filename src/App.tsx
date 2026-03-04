import React, { useState, useCallback } from 'react';
import { useSolitaire } from '@/hooks/useSolitaire';
import type { Card as CardType } from '@/types/game';
import { StockPile, WastePile, FoundationPile, TableauPile } from '@/components/Piles';
import WinAnimation from '@/components/WinAnimation';
import MenuBar from '@/components/MenuBar';
import './App.css';

function App() {
  const {
    gameState,
    winAnimation,
    dealFromStock,
    moveCard,
    autoMoveToFoundation,
    newGame,
    setDrawMode,
    formatTime,
  } = useSolitaire();

  const [dragOverPile, setDragOverPile] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, _card: CardType, sourcePile: string, sourceIndex: number) => {
    e.dataTransfer.setData('sourcePile', sourcePile);
    e.dataTransfer.setData('sourceIndex', sourceIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, pileId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPile(pileId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverPile(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetPile: string) => {
    e.preventDefault();
    setDragOverPile(null);

    const sourcePile = e.dataTransfer.getData('sourcePile');
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'), 10);

    if (sourcePile && !isNaN(sourceIndex)) {
      moveCard(sourcePile, sourceIndex, targetPile);
    }
  }, [moveCard]);

  const handleToggleDrawMode = useCallback(() => {
    setDrawMode(gameState.drawMode === 1 ? 3 : 1);
  }, [gameState.drawMode, setDrawMode]);

  return (
    <div className="solitaire-window">
      {/* Title Bar */}
      <div className="title-bar">
        <span className="title-bar-text">Solitaire</span>
        <button className="title-bar-close" onClick={() => window.location.reload()}>
          ×
        </button>
      </div>

      {/* Menu Bar */}
      <MenuBar
        onNewGame={newGame}
        onToggleDrawMode={handleToggleDrawMode}
        drawMode={gameState.drawMode}
      />

      {/* Game Area */}
      <div className="game-area">
        {/* Top Row: Stock, Waste, and Foundations */}
        <div className="top-row">
          <div className="stock-waste">
            <StockPile cards={gameState.stock} onClick={dealFromStock} />
            <WastePile
              cards={gameState.waste}
              onCardClick={() => autoMoveToFoundation('waste')}
              onCardDoubleClick={() => autoMoveToFoundation('waste')}
              onDragStart={(e) => handleDragStart(e, gameState.waste[gameState.waste.length - 1], 'waste', gameState.waste.length - 1)}
            />
          </div>

          <div className="foundations">
            {gameState.foundations.map((foundation, index) => (
              <FoundationPile
                key={index}
                cards={foundation}
                suitIndex={index}
                onDrop={(e) => handleDrop(e, `foundation-${index}`)}
                onDragOver={(e) => handleDragOver(e, `foundation-${index}`)}
                onDragLeave={handleDragLeave}
                isDragOver={dragOverPile === `foundation-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="tableau">
          {gameState.tableau.map((pile, index) => (
            <TableauPile
              key={index}
              cards={pile}
              pileIndex={index}
              onDrop={(e) => handleDrop(e, `tableau-${index}`)}
              onDragOver={(e) => handleDragOver(e, `tableau-${index}`)}
              onDragLeave={handleDragLeave}
              onCardDragStart={(e, card, cardIndex) =>
                handleDragStart(e, card, `tableau-${index}`, cardIndex)
              }
              onCardDoubleClick={() =>
                autoMoveToFoundation(`tableau-${index}`, 0)
              }
              isDragOver={dragOverPile === `tableau-${index}`}
            />
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span>Score: {gameState.score}</span>
        </div>
        <div className="status-item">
          <span>Time: {formatTime(gameState.time)}</span>
        </div>
        <div className="status-item">
          <span>Moves: {gameState.moves}</span>
        </div>
      </div>

      {/* Win Animation */}
      {winAnimation && (
        <WinAnimation
          foundations={gameState.foundations}
          onComplete={() => {}}
        />
      )}

      {/* Win Dialog */}
      {gameState.gameWon && !winAnimation && (
        <div className="win-dialog-overlay">
          <div className="win-dialog">
            <div className="win-dialog-title">Congratulations!</div>
            <div className="win-dialog-message">You won the game!</div>
            <div className="win-dialog-buttons">
              <button className="win-button" onClick={newGame}>
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
