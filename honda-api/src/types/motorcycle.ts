export interface Motorcycle {
  id: number;
  name: string;
  category: 'sport' | 'scooter' | 'adventure';
  price: number;
  image: string;
  specs: string;
  available: boolean;
}