// request -> /create_card
export interface CreateCard {
  access_token: [number, number];
  deck_id: number;
  question: string;
  answer: string;
}

// request -> /create_card_deck
export interface CreateCardDeck {
  access_token: [number, number];
  deck_name: string;
}

// request -> /new_user
export interface NewUser {
  user_name: string;
  email: string;
  password: string;
}

// request -> /list_card_decks
export interface ListCardDecks {
  access_token: [number, number];
}

// response <- /list_card_decks
export interface ListCardDecksResponse {
  decks: CardDeck[];
}

export interface CardDeck {
  name: string;
  deck_id: number;
  num_cards: number;
}

// request -> /list_cards
export interface ListCards {
  access_token: [number, number];
  deck_id: number;
}

// response <- /list_cards
export interface ListCardsResponse {
  cards: Card[];
}

export interface Card {
  question: string;
  answer: string;
}

// request -> /login
export interface LoginRequest {
  username: string;
  password: string;
}

// response <- /login
export interface LoginResponse {
  access_token: [number, number];
}
