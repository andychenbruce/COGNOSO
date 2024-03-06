export const ENDPOINT_CREATE_CARD_DECK: string = "/create_card_deck";
export const ENDPOINT_DELETE_CARD_DECK: string = "/delete_card_deck";
export const ENDPOINT_SET_DECK_ICON: string = "/set_deck_icon";

export const ENDPOINT_ADD_RATING: string = "/add_rating";
export const ENDPOINT_GET_RATING: string = "/get_rating";

export const ENDPOINT_CREATE_CARD: string = "/create_card";
export const ENDPOINT_DELETE_CARD: string = "/delete_card";
export const ENDPOINT_EDIT_CARD: string = "/edit_card";

export const ENDPOINT_LIST_CARD_DECKS: string = "/list_card_decks";
export const ENDPOINT_GET_DECK: string = "/get_deck";
export const ENDPOINT_LIST_CARDS: string = "/list_cards";

export const ENDPOINT_LOGIN: string = "/login";
export const ENDPOINT_NEW_USER: string = "/new_user";
export const ENDPOINT_DELETE_USER: string = "/delete_user";
export const ENDPOINT_CHANGE_PASSWORD: string = "/change_password";

export const ENDPOINT_SEARCH_DECKS: string = "/search_decks";

export const ENDPOINT_LIST_FAVORITES: string = "/list_favorites";
export const ENDPOINT_ADD_FAVORITE: string = "/list_favorites";

export const ENDPOINT_AI_TEST: string = "/ai_test";
export const ENDPOINT_CREATE_DECK_PDF: string = "/create_card_deck_pdf";

type AccessToken = [number, number];

export interface Card {
  question: string;
  answer: string;
}

export interface CardDeck {
  name: string;
  user_id: number;
  deck_id: number;
  num_cards: number;
  icon_num: number;
  get_rating: number;
  add_rating: number;
}

// request -> ENDPOINT_CREATE_CARD
export interface CreateCard {
  access_token: AccessToken;
  deck_id: number;
  question: string;
  answer: string;
}

// request -> ENDPOINT_DELETE_CARD
export interface DeleteCard {
  access_token: AccessToken;
  deck_id: number;
  card_index: number;
}

// request -> ENDPOINT_EDIT_CARD
export interface EditCard {
  access_token: AccessToken;
  deck_id: number;
  card_index: number;
  new_question: String;
  new_answer: string;
}

// request -> ENDPOINT_CREATE_CARD_DECK
export interface CreateCardDeck {
  access_token: AccessToken;
  deck_name: string;
}

// request -> ENDPOINT_DELETE_CARD_DECK
export interface DeleteCardDeck {
  access_token: AccessToken;
  deck_id: number;
}

// request -> ENDPOINT_ADD_RATING
export interface GetRating {
  access_token: AccessToken,
  deck_id: number,
}

// response <- ENDPOINT_ADD_RATING
export interface AddRating {
  access_token: AccessToken,
  deck_id: number,
  new_rating: number,
}

// request -> ENDPOINT_SET_DECK_ICON
export interface SetDeckIcon {
  access_token: AccessToken;
  deck_id: number;
  icon: number;
}

// request -> ENDPOINT_NEW_USER
export interface NewUser {
  user_name: string;
  email: string;
  password: string;
}

// request -> ENDPOINT_DELETE_USER
export interface DeleteUser {
  email: string;
  password: string;
}

// request -> ENDPOINT_CHANGE_PASSWORD
export interface ChangePassword {
  email: string;
  old_password: string;
  new_password: string;
}

// request -> ENDPOINT_LIST_CARD_DECKS
export interface ListCardDecks {
  access_token: AccessToken;
}

// response <- ENDPOINT_LIST_CARD_DECKS
export interface ListCardDecksResponse {
  decks: CardDeck[];
}

// request -> ENDPOINT_GET_DECK
export interface GetDeckRequest {
  user_id: number;
  deck_id: number;
}

export type GetDeckResponse = CardDeck;

// request -> ENDPOINT_LIST_CARDS
export interface ListCards {
  user_id: number;
  deck_id: number;
}

// response <- ENDPOINT_LIST_CARDS
export interface ListCardsResponse {
  cards: Card[];
}

// request -> ENDPOINT_LOGIN
export interface LoginRequest {
  email: string;
  password: string;
}

// response <- ENDPOINT_LOGIN
export interface LoginResponse {
  access_token: AccessToken;
  user_id: number;
}

// request -> ENDPOINT_SEARCH_DECKS
export interface SearchDecksRequest {
  prompt: string;
}

// response <- ENDPOINT_SEARCH_DECKS
export interface SearchDecksResponse {
  decks: CardDeck[];
}

// request -> ENDPOINT_CREATE_DECK_PDF
export interface UploadPdf {
  access_token: AccessToken;
  deck_id: number;
  file_bytes_base64: string;
}

// request -> ENDPOINT_AI_TEST
export interface AiPromptTest {
  prompt: string;
}

// request -> ENDPOINT_LIST_FAVORITES
export interface ListFavoritesRequest {
  access_token: AccessToken;
}

// response <- ENDPOINT_LIST_FAVORITES
export interface ListFavoritesResponse {
  decks: CardDeck[];
}

// request -> ENDPOINT_ADD_FAVORITE
export interface AddFavorite {
  access_token: AccessToken,
  user_id: number,
  deck_id: number,
}

