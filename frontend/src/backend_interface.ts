export const ENDPOINT_CREATE_CARD_DECK: string = "/create_card_deck";
export const ENDPOINT_DELETE_CARD_DECK: string = "/delete_card_deck";
export const ENDPOINT_GET_DECK_NAME: string = "/get_deck_name";
export const ENDPOINT_LIST_CARD_DECKS: string = "/list_card_decks";

export const ENDPOINT_CREATE_CARD: string = "/create_card";
export const ENDPOINT_DELETE_CARD: string = "/delete_card";
export const ENDPOINT_EDIT_CARD: string = "/edit_card";
export const ENDPOINT_LIST_CARDS: string = "/list_cards";

export const ENDPOINT_LOGIN: string = "/login";
export const ENDPOINT_NEW_USER: string = "/new_user";
export const ENDPOINT_DELETE_USER: string = "/delete_user";
export const ENDPOINT_CHANGE_PASSWORD: string = "/change_password";

export const ENDPOINT_SEARCH_DECKS: string = "/search_decks";

export const ENDPOINT_AI_TEST: string = "/ai_test";
export const ENDPOINT_CREATE_DECK_PDF: string = "/create_card_deck_pdf";

// request -> /create_card
export interface CreateCard {
  access_token: [number, number];
  deck_id: number;
  question: string;
  answer: string;
}

// request -> /delete_card
export interface DeleteCard {
  access_token: [number, number];
  deck_id: number;
  card_index: number;
}

// request -> /edit_card
export interface EditCard {
  access_token: [number, number];
  deck_id: number,
  card_index: number,
  new_question: String,
  new_answer: string,
}

// request -> /create_card_decki
export interface CreateCardDeck {
  access_token: [number, number];
  deck_name: string;
}

//request -> /get_deck_name
export interface GetDeckName {
  access_token: [number, number];
  deck_id: number;
}


// request -> /delete_card_deck
export interface DeleteCardDeck {
  access_token: [number, number];
  deck_id: number;
}


// request -> /new_user
export interface NewUser {
  user_name: string;
  email: string;
  password: string;
}

// request -> /delete_user
export interface DeleteUser {
  email: string;
  password: string;
}

// request -> /change_password
export interface ChangePassword {
  email: string;
  old_password: string;
  new_password: string;
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
  email: string;
  password: string;
}

// response <- /login
export interface LoginResponse {
  access_token: [number, number];
}

//requets <- /search_decks
export interface SearchDecksRequest {
  prompt: string;
}


//response <- /search_decks//request 
export interface SearchDecksResponse {
   decks: [[number, number]]; // list of (userid, deck_id) pairs
}


// request -> /create_deck_pdf
export interface UploadPdf {
  access_token: [number, number];
  deck_id: number;
  file_bytes_base64: string;
}

// request -> /create_deck_pdf
export interface AiPromptTest {
  prompt: string;
}
