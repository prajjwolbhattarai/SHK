import { Article, Business } from '../types';

// IMPORTANT: Replace this with your actual Google Apps Script Web App URL.
// It must be deployed to be accessible.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxw9Sw74S1Yy5W0zVCRHZ7ZxTTOISUKZzk793WkeR8TW9eF61Mws4aGcOPRg1JaiUBuPQ/exec'; 

interface SyncPayload {
  articles: Article[];
  directory: Business[];
}

interface FetchResponse {
  articles: Article[];
  directory: Business[];
}

/**
 * Syncs CMS state to Google Apps Script.
 */
export const syncDataWithGoogle = async (payload: SyncPayload): Promise<FetchResponse> => {
  if (!APPS_SCRIPT_URL) {
    console.error("Google Apps Script URL is not configured in services/googleApiService.ts.");
    return Promise.resolve({ articles: payload.articles, directory: payload.directory });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors', 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify({ action: 'sync', data: payload }), 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: FetchResponse = await response.json();
    return result;

  } catch (error) {
    console.error("Failed to sync data with Google:", error);
    throw error;
  }
};

/**
 * Fetches the latest data from Google Apps Script.
 */
export const fetchLiveContent = async (): Promise<FetchResponse | null> => {
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch live content:", error);
        return null;
    }
};
