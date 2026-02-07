
import { AppState, Expense } from '../types';

const STORAGE_KEY = 'pln_tracker_data';
const LAST_EMAIL_KEY = 'pln_tracker_last_email';

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse stored state", e);
    }
  }
  return { user: null, expenses: [] };
};

export const saveLastEmail = (email: string) => {
  localStorage.setItem(LAST_EMAIL_KEY, email);
};

export const loadLastEmail = (): string | null => {
  return localStorage.getItem(LAST_EMAIL_KEY);
};

// Simple sharing mechanism using window.location.hash
export const serializeState = (expenses: Expense[]): string => {
  const data = JSON.stringify(expenses);
  return btoa(unescape(encodeURIComponent(data)));
};

export const deserializeState = (hash: string): Expense[] | null => {
  try {
    const data = decodeURIComponent(escape(atob(hash)));
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to deserialize state from hash", e);
    return null;
  }
};
