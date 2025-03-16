import { CardType, PlayerType, GameStateType } from './types/game';

// Mock Cards
export const mockCards: CardType[] = [
  {
    id: 'card1',
    name: 'Arcane Signet',
    type: 'Artifact',
    imageUrl: 'https://cards.scryfall.io/normal/front/1/b/1bf50ef8-e7e8-4099-ba91-0d7c31b04541.jpg?1661391940',
    manaCost: '{2}',
    text: '{T}: Add one mana of any color in your commander\'s color identity.'
  },
  {
    id: 'card2',
    name: 'Sol Ring',
    type: 'Artifact',
    imageUrl: 'https://cards.scryfall.io/normal/front/4/c/4cbc6901-6a4a-4d0a-83ea-7eefa3b35021.jpg?1625979257',
    manaCost: '{1}',
    text: '{T}: Add {C}{C}.'
  },
  {
    id: 'card3',
    name: 'Command Tower',
    type: 'Land',
    imageUrl: 'https://cards.scryfall.io/normal/front/7/e/7eafe88e-ab38-442c-b147-bb01cc81178d.jpg?1673484253',
    text: '{T}: Add one mana of any color in your commander\'s color identity.'
  },
  {
    id: 'card4',
    name: 'Counterspell',
    type: 'Instant',
    imageUrl: 'https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg?1628801663',
    manaCost: '{U}{U}',
    text: 'Counter target spell.'
  },
  {
    id: 'card5',
    name: 'Swords to Plowshares',
    type: 'Instant',
    imageUrl: 'https://cards.scryfall.io/normal/front/f/5/f51f8b98-6f8e-4fba-9b1d-ac8dfdd4c007.jpg?1631651524',
    manaCost: '{W}',
    text: 'Exile target creature. Its controller gains life equal to its power.'
  },
  {
    id: 'card6',
    name: 'Birds of Paradise',
    type: 'Creature',
    imageUrl: 'https://cards.scryfall.io/normal/front/f/e/feefe9f0-24a6-461c-9ef1-86c5a6f33b83.jpg?1594681430',
    manaCost: '{G}',
    power: '0',
    toughness: '1',
    text: 'Flying\n{T}: Add one mana of any color.'
  },
  {
    id: 'card7',
    name: 'Atraxa, Praetors\' Voice',
    type: 'Legendary Creature',
    imageUrl: 'https://cards.scryfall.io/normal/front/d/0/d0d33d52-3d28-4635-b985-51e126289259.jpg?1599707796',
    manaCost: '{G}{W}{U}{B}',
    power: '4',
    toughness: '4',
    text: 'Flying, vigilance, deathtouch, lifelink\nAt the beginning of your end step, proliferate.'
  },
  {
    id: 'card8',
    name: 'Rhystic Study',
    type: 'Enchantment',
    imageUrl: 'https://cards.scryfall.io/normal/front/d/6/d6914dba-0d27-4055-ac34-b3ebf5802221.jpg?1600698439',
    manaCost: '{2}{U}',
    text: 'Whenever an opponent casts a spell, you may draw a card unless that player pays {1}.'
  }
];

// Mock Commander
export const mockCommander: CardType = {
  id: 'commander1',
  name: 'Kenrith, the Returned King',
  type: 'Legendary Creature',
  imageUrl: 'https://cards.scryfall.io/normal/front/5/6/56c1227e-bea7-47cb-bbec-389a3d585af5.jpg?1637568481',
  manaCost: '{4}{W}',
  power: '5',
  toughness: '5',
  text: '{W}: Target player gains 5 life.\n{U}: Target player draws a card.\n{B}, {2}: Put a +1/+1 counter on target creature.\n{R}: Target creature gains trample and haste until end of turn.\n{G}: Return target permanent card from your graveyard to your hand.'
};

// Mock Players
export const mockPlayers: PlayerType[] = [
  {
    id: 'player1',
    name: 'You',
    life: 40,
    isActive: true,
    poisonCounters: 0,
    hand: mockCards.slice(0, 3),
    graveyard: [mockCards[3]],
    exile: [],
    battlefield: [mockCards[5], mockCards[6]],
    commandZone: [mockCommander]
  },
  {
    id: 'player2',
    name: 'Opponent',
    life: 36,
    isActive: false,
    poisonCounters: 1,
    hand: [],
    graveyard: [],
    exile: [],
    battlefield: [mockCards[7]],
    commandZone: []
  }
];

// Mock Game State
export const mockGameState: GameStateType = {
  players: mockPlayers,
  activePlayerId: 'player1',
  phase: 'main1',
  turn: 3,
  stack: [],
  battlefield: [],
  commandZone: [],
  exile: []
}; 