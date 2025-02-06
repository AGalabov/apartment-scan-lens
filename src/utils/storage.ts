import { ListingsState, Listing } from "../types/types";

const STORAGE_KEY = "apartment-listings";

export const loadListings = (): ListingsState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { offers: [] };
};

export const saveListings = (state: ListingsState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const exportListings = (): string => {
  return JSON.stringify({ offers: loadListings().offers }, null, 2);
};

export const importListings = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data.offers)) {
      saveListings({ offers: data.offers });
      return true;
    }
    return false;
  } catch {
    return false;
  }
};