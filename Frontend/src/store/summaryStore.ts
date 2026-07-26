import { create } from 'zustand';
import type { Summary } from '../types/summary';

interface SummaryState {
  url: string;
  summary: Summary | null;
  isLoading: boolean;
  error: string | null;
  setUrl: (url: string) => void;
  setSummary: (summary: Summary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  url: '',
  summary: null,
  isLoading: false,
  error: null,
  setUrl: (url) => set({ url }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ url: '', summary: null, isLoading: false, error: null }),
}));
