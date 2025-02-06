export interface Listing {
  id: string;
  title: string;
  url: string;
  tags: string[];
}

export interface ListingsState {
  offers: Listing[];
}