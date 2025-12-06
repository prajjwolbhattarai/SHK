
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
 * This function sends the current state of the CMS to your Google Apps Script backend.
 * Your script should be configured to handle a POST request, parse the JSON body,
 * and update your Google Doc (for articles) and Google Sheet (for directory).
 */
export const syncDataWithGoogle = async (payload: SyncPayload): Promise<FetchResponse> => {
  if (!APPS_SCRIPT_URL) {
    console.error("Google Apps Script URL is not configured in services/googleApiService.ts.");
    // Simulate a successful response in development if the URL is not set.
    // This allows the UI to function without a live backend.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    console.log("DEV MODE: Simulating successful sync.");
    return Promise.resolve({ articles: payload.articles, directory: payload.directory });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      // The 'mode: no-cors' is often a necessary evil when calling Apps Script from a different origin (like localhost or github.io)
      // if you haven't set up CORS headers correctly in the script response. A proper CORS setup is better.
      mode: 'cors', 
      headers: {
        // Apps Script's `doPost(e)` function receives the data in `e.postData.contents`.
        // Sending as text/plain is the most reliable way to get raw JSON string.
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      // We stringify the entire payload. Your Apps Script will need to do `JSON.parse(e.postData.contents)`.
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