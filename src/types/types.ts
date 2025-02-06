export interface Listing {
  id: string;
  title: string;
  url: string;
  tags: string[];
  imageUrl?: string;
}

export interface ListingsState {
  offers: Listing[];
}