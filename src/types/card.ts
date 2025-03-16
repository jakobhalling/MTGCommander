export interface Card {
  id: string;
  name: string;
  types: string[];
  manaCost: string;
  power?: string;
  toughness?: string;
  text?: string;
  imageUrl?: string;
  scryfallId?: string;
  colors?: string[];
  colorIdentity?: string[];
  cmc?: number;
  rarity?: string;
  setCode?: string;
} 