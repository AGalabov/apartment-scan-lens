
export interface Listing {
  id: string;
  title: string;
  url: string;
  tags: string[];
  imageUrl?: string;
  traits?: Record<string, "YES" | "NO" | null>;
}

export interface ListingsState {
  offers: Listing[];
  traits: string[];
}
