// src/types/dealer.ts
// Defines the data structure for a single dealer.

export interface Dealer {
  id: number;
  name: string;
  address: string;
  phone?: string; // Optional phone number
  website?: string; // Optional website
  coordinates: {
    lat: number;
    lng: number;
  };
}
