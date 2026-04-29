export interface Game {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  category: string;
  addedBy: string;
  createdAt: any; // Firestore Timestamp
}

export interface GameData {
  games: Game[];
  categories: string[];
}
