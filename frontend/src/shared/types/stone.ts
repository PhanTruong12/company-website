// shared/types/stone.ts - Stone domain types
export interface StoneType {
  _id: string;
  name: string;
  slug?: string;
  nameEn?: string;
  description?: string;
  isActive: boolean;
}

export interface WallPosition {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  isActive: boolean;
}
