import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Stack
} from '@carbon/react';
import Card from './Card';
import Zone from './Zone';
import PlayerArea from './PlayerArea';
import GameBoard from './GameBoard';
import ActionPanel from './ActionPanel';
import { mockCards, mockPlayers, mockGameState } from '../mockData';
import { CardType } from '../types/game';

const ComponentShowcase: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  return (
    <div className="component-showcase">
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <Stack gap={7}>
            <h1>MTG Commander Component Showcase</h1>
            
            {selectedCard && (
              <Tile>
                <Grid>
                  <Column lg={4} md={2} sm={4}>
                    {selectedCard.imageUrl && (
                      <img 
                        src={selectedCard.imageUrl} 
                        alt={selectedCard.name} 
                        className="w-full rounded-md"
                      />
                    )}
                  </Column>
                  <Column lg={12} md={6} sm={4}>
                    <Stack gap={5}>
                      <h2>{selectedCard.name}</h2>
                      <p><strong>Type:</strong> {selectedCard.type}</p>
                      {selectedCard.manaCost && (
                        <p><strong>Mana Cost:</strong> {selectedCard.manaCost}</p>
                      )}
                      {selectedCard.power && selectedCard.toughness && (
                        <p><strong>P/T:</strong> {selectedCard.power}/{selectedCard.toughness}</p>
                      )}
                      {selectedCard.text && (
                        <div>
                          <strong>Text:</strong>
                          <p className="whitespace-pre-line">{selectedCard.text}</p>
                        </div>
                      )}
                      <Button
                        kind="danger"
                        size="sm"
                        onClick={() => setSelectedCard(null)}
                      >
                        Close
                      </Button>
                    </Stack>
                  </Column>
                </Grid>
              </Tile>
            )}
            
            <Tabs>
              <TabList aria-label="Component tabs" contained>
                <Tab>Cards</Tab>
                <Tab>Zones</Tab>
                <Tab>Player Areas</Tab>
                <Tab>Game Board</Tab>
                <Tab>Actions</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack gap={7}>
                    <div>
                      <h2>Card Components</h2>
                      <Grid narrow>
                        {mockCards.map(card => (
                          <Column key={card.id} lg={4} md={4} sm={4}>
                            <Card card={card} onClick={handleCardClick} />
                          </Column>
                        ))}
                      </Grid>
                    </div>
                    
                    <div>
                      <h3>Card States</h3>
                      <Grid narrow>
                        <Column lg={4} md={4} sm={4}>
                          <Stack gap={5}>
                            <Tag type="blue">Normal</Tag>
                            <Card card={mockCards[0]} onClick={handleCardClick} />
                          </Stack>
                        </Column>
                        <Column lg={4} md={4} sm={4}>
                          <Stack gap={5}>
                            <Tag type="magenta">Tapped</Tag>
                            <Card card={mockCards[0]} isTapped={true} onClick={handleCardClick} />
                          </Stack>
                        </Column>
                        <Column lg={4} md={4} sm={4}>
                          <Stack gap={5}>
                            <Tag type="purple">Selected</Tag>
                            <Card card={mockCards[0]} isSelected={true} onClick={handleCardClick} />
                          </Stack>
                        </Column>
                        <Column lg={4} md={4} sm={4}>
                          <Stack gap={5}>
                            <Tag type="cyan">Tapped & Selected</Tag>
                            <Card card={mockCards[0]} isTapped={true} isSelected={true} onClick={handleCardClick} />
                          </Stack>
                        </Column>
                      </Grid>
                    </div>
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Stack gap={7}>
                    <h2>Zone Components</h2>
                    <Grid narrow>
                      <Column lg={8} md={4} sm={4}>
                        <Tile>
                          <Stack gap={5}>
                            <h3>Hand Zone</h3>
                            <Zone 
                              name="hand" 
                              playerId="player1" 
                              cards={mockCards.slice(0, 3)} 
                              onCardClick={handleCardClick}
                            />
                          </Stack>
                        </Tile>
                      </Column>
                      <Column lg={8} md={4} sm={4}>
                        <Tile>
                          <Stack gap={5}>
                            <h3>Battlefield Zone</h3>
                            <Zone 
                              name="battlefield" 
                              playerId="player1" 
                              cards={mockCards.slice(5, 7)} 
                              onCardClick={handleCardClick}
                            />
                          </Stack>
                        </Tile>
                      </Column>
                      <Column lg={8} md={4} sm={4}>
                        <Tile>
                          <Stack gap={5}>
                            <h3>Graveyard Zone</h3>
                            <Zone 
                              name="graveyard" 
                              playerId="player1" 
                              cards={[mockCards[3]]} 
                              onCardClick={handleCardClick}
                            />
                          </Stack>
                        </Tile>
                      </Column>
                      <Column lg={8} md={4} sm={4}>
                        <Tile>
                          <Stack gap={5}>
                            <h3>Exile Zone</h3>
                            <Zone 
                              name="exile" 
                              playerId="player1" 
                              cards={[]} 
                              onCardClick={handleCardClick}
                            />
                          </Stack>
                        </Tile>
                      </Column>
                      <Column lg={8} md={4} sm={4}>
                        <Tile>
                          <Stack gap={5}>
                            <h3>Command Zone</h3>
                            <Zone 
                              name="command-zone" 
                              playerId="player1" 
                              cards={[mockCards[6]]} 
                              onCardClick={handleCardClick}
                            />
                          </Stack>
                        </Tile>
                      </Column>
                    </Grid>
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Stack gap={7}>
                    <h2>Player Area Components</h2>
                    <Grid narrow>
                      {mockPlayers.map((player, index) => (
                        <Column key={player.id} lg={16} md={8} sm={4}>
                          <Tile>
                            <Stack gap={5}>
                              <h3>
                                {player.name} {player.isActive && <Tag type="green">Active</Tag>}
                              </h3>
                              <PlayerArea 
                                player={player} 
                                position={index === 0 ? 'bottom' : 'top'} 
                              />
                            </Stack>
                          </Tile>
                        </Column>
                      ))}
                    </Grid>
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Stack gap={7}>
                    <h2>Game Board Component</h2>
                    <Tile>
                      <GameBoard />
                    </Tile>
                  </Stack>
                </TabPanel>

                <TabPanel>
                  <Stack gap={7}>
                    <h2>Action System</h2>
                    <Tile>
                      <Stack gap={5}>
                        <p>
                          This panel demonstrates the new action system that allows for validated game actions.
                          Try selecting a card and performing actions on it.
                        </p>
                        <ActionPanel playerId={mockPlayers[0].id} />
                      </Stack>
                    </Tile>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </Column>
      </Grid>
    </div>
  );
};

export default ComponentShowcase;