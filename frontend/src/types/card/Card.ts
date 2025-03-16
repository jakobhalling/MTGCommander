export interface Card {
  id: string;
  name: string;
  types: string[];
  manaCost?: string;
  power?: string;
  toughness?: string;
  text?: string;
  imageUrl?: string;
  setCode?: string;
  rarity?: string;
  colors?: string[];
} 