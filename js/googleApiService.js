// IMPORTANT: Replace this with your actual Google Apps Script Web App URL.
const APPS_SCRIPT_URL = '';

/**
 * Sends the current CMS state to your Google Apps Script backend.
 * The script should handle a POST request, parse the JSON, and update Google Docs/Sheets.
 * It should then return the latest data from the sheets.
 */
export const syncDataWithGoogle = async (payload) => {
  if (!APPS_SCRIPT_URL) {
    console.error("Google Apps Script URL is not configured in js/googleApiService.js.");
    // Simulate a successful response in development if the URL is not set.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    console.log("DEV MODE: Simulating successful sync. Returning local data.");
    return Promise.resolve({ articles: payload.articles, directory: payload.directory });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors', 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      // Apps Script receives this in `e.postData.contents`.
      body: JSON.stringify({ action: 'sync', data: payload }), 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Failed to sync data with Google:", error);
    throw error;
  }
};
