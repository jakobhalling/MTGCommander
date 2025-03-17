import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Grid, 
  Column, 
  Tile,
  Tag,
  Loading,
  InlineNotification,
  AspectRatio
} from '@carbon/react';
import { GameBoardProps, PlayerType, PlayerPosition } from '../types/game';
import PlayerArea from './PlayerArea';
import Zone from './Zone';
import { RootState } from '../store';

const GameBoard: React.FC<GameBoardProps> = () => {
  const gameState = useSelector((state: RootState) => state.game.currentGame);
  
  const players: PlayerType[] = gameState ? 
    Object.values(gameState.players).map(player => ({
      id: player.id,
      name: player.name,
      life: player.life,
      isActive: player.id === gameState.activePlayer,
      poisonCounters: 0,
      hand: [],
      graveyard: [],
      exile: [],
      battlefield: [],
      commandZone: []
    })) : [];

  const getPlayerPosition = (index: number, totalPlayers: number): PlayerPosition => {
    if (totalPlayers <= 2) {
      return index === 0 ? 'bottom' : 'top';
    } else if (totalPlayers <= 4) {
      const positions: PlayerPosition[] = ['bottom', 'top', 'left', 'right'];
      return positions[index % positions.length];
    } else {
      return 'bottom';
    }
  };

  if (!gameState) {
    return (
      <AspectRatio ratio="1x1">
        <div className="flex items-center justify-center">
          <Loading 
            description="Loading game state..." 
            withOverlay={false}
          />
        </div>
      </AspectRatio>
    );
  }

  return (
    <Grid fullWidth>
      {/* Game Status Bar */}
      <Column lg={16} md={8} sm={4}>
        <InlineNotification
          kind="info"
          title="Game Status"
          subtitle={`Turn ${gameState.turnNumber} | Phase: ${gameState.phase}`}
          lowContrast
          hideCloseButton
        />
      </Column>

      {/* Player Areas */}
      <Column lg={16} md={8} sm={4}>
        <Grid narrow>
          {players.map((player: PlayerType, index: number) => (
            <Column 
              key={player.id} 
              lg={players.length <= 2 ? 16 : 8} 
              md={8} 
              sm={4}
              className={`player-position-${getPlayerPosition(index, players.length)}`}
            >
              <PlayerArea 
                player={player} 
                position={getPlayerPosition(index, players.length)} 
              />
            </Column>
          ))}
        </Grid>
      </Column>

      {/* Shared Zones */}
      <Column lg={16} md={8} sm={4}>
        <Grid narrow className="shared-zones">
          <Column lg={10} md={4} sm={4}>
            <Tile>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Shared Battlefield</h3>
                {gameState.activePlayer && (
                  <Tag type="green">
                    Active: {players.find(p => p.id === gameState.activePlayer)?.name}
                  </Tag>
                )}
              </div>
              <Zone 
                name="battlefield" 
                playerId="shared" 
                cards={[]} 
              />
            </Tile>
          </Column>
          
          <Column lg={6} md={4} sm={4}>
            <Tile>
              <h3 className="text-lg font-semibold mb-4">Command Zone</h3>
              <Zone 
                name="command-zone" 
                playerId="shared" 
                cards={[]} 
              />
            </Tile>
          </Column>
        </Grid>
      </Column>
    </Grid>
  );
};

export default GameBoard;