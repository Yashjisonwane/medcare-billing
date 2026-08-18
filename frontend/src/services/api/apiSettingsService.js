const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/settings` : 'http://localhost:5000/v1/settings';

export const getGeneralSettings = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching general settings:', error);
    throw error;
  }
};

export const updateGeneralSettings = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return await response.json();
  } catch (error) {
    console.error('Error updating general settings:', error);
    throw error;
  }
};
