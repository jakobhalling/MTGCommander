import React from 'react';
import { PlayerType, PlayerPosition } from '../types/game';
import Zone from './Zone';
import {
  Grid,
  Column,
  Tile,
  Tag,
  ProgressBar,
  OverflowMenu,
  OverflowMenuItem
} from '@carbon/react';

interface PlayerAreaProps {
  player: PlayerType;
  position: PlayerPosition;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({ player, position }) => {
  const playerClasses = [
    'player-area',
    `player-position-${position}`,
    player.isActive ? 'active-player' : ''
  ].filter(Boolean).join(' ');

  const startingLife = 40; // Commander format starts at 40 life

  return (
    <Tile className={playerClasses}>
      <Grid narrow>
        <Column lg={16} md={8} sm={4}>
          {/* Player Info Header */}
          <div className="player-info">
            <div className="flex items-center">
              <span className="player-name">{player.name}</span>
              {player.isActive && <Tag type="green" className="ml-2">Active</Tag>}
            </div>
            
            <div className="flex items-center">
              <OverflowMenu flipped>
                <OverflowMenuItem itemText="View Details" />
                <OverflowMenuItem itemText="Show Cards" />
                <OverflowMenuItem 
                  itemText="Concede Game" 
                  kind="danger"
                  hasDivider
                />
              </OverflowMenu>
            </div>
          </div>
          
          {/* Life and Status Bars */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span>Life Total</span>
              <span>{player.life}/{startingLife}</span>
            </div>
            <ProgressBar 
              value={player.life}
              max={startingLife}
              helperText="Life Total"
              hideLabel
              label="Life Total"
              status={player.life <= 10 ? "error" : undefined}
            />
            
            {player.poisonCounters > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span>Poison Counters</span>
                  <span>{player.poisonCounters}/10</span>
                </div>
                <ProgressBar 
                  value={player.poisonCounters}
                  max={10}
                  helperText="Poison Counters"
                  hideLabel
                  label="Poison Counters"
                  status="error"
                />
              </div>
            )}
          </div>
        </Column>
        
        {/* Player Zones */}
        <Column lg={16} md={8} sm={4}>
          <div className="player-zones">
            <Zone
              name="hand"
              playerId={player.id}
              cards={player.hand}
            />
            <Zone
              name="battlefield"
              playerId={player.id}
              cards={player.battlefield}
            />
            <Zone
              name="graveyard"
              playerId={player.id}
              cards={player.graveyard}
            />
            <Zone
              name="exile"
              playerId={player.id}
              cards={player.exile}
            />
            <Zone
              name="command"
              playerId={player.id}
              cards={player.commandZone}
            />
          </div>
        </Column>
      </Grid>
    </Tile>
  );
};

export default PlayerArea;