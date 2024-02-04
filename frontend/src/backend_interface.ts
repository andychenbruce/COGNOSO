export interface CreateCard {
    access_token: [number, number];
    deck_id: number;
    question: string;
    answer: string;
}

export interface CreateCardDeck {
    access_token: [number, number];
    deck_name: string;
}

export interface NewUser {
  user_name: string;
  email: string;
  password: string;
}

export interface ListCardDecks {
    access_token: [number, number];
}

export interface ListCardDecksResponse {
  decks: CardDeck[];
}

export interface CardDeck {
    name: string;
    deck_id: number;
    num_cards: number;
}

export interface ListCards {
  access_token: [number, number];
  deck_id: number;
}

export interface ListCardsResponse {
    cards: Card[];
}

export interface Card {
  question: string;
  answer: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
  access_token: [number, number];
}


