const BASE_URL = '/auth';

export async function syncUser(token: string) {
  const response = await fetch(`${BASE_URL}/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Sync failed: ${response.status}`);
  }

  return response.json();
}

export async function getMe(token: string) {
  const response = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch user: ${response.status}`);
  }

  return response.json();
}
