
import { ListingsState, Listing } from "../types/types";

const STORAGE_KEY = "apartment-listings";

export const loadListings = (): ListingsState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { offers: [], traits: [] };
  
  const parsed = JSON.parse(stored);
  // Ensure backward compatibility
  return {
    offers: parsed.offers || [],
    traits: parsed.traits || []
  };
};

export const saveListings = (state: ListingsState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const exportListings = (): string => {
  return JSON.stringify(loadListings(), null, 2);
};

export const importListings = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.offers)) {
      const state: ListingsState = {
        offers: data.offers,
        traits: data.traits || []
      };
      saveListings(state);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
