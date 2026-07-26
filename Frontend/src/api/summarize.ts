import type { Summary } from '../types/summary';

const BASE_URL = '/summarize';

export async function fetchSummary(url: string): Promise<Summary> {
  const params = new URLSearchParams({ target_url: url });
  const response = await fetch(`${BASE_URL}/?${params.toString()}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Server error: ${response.status}`);
  }

  return response.json() as Promise<Summary>;
}
