// --- CONFIGURATION ---
// 1. Copy this entire code into your Google Apps Script editor.
// 2. Deploy as Web App -> Execute as: Me -> Access: Anyone.

// The ID of your specific Google Doc.
const DOC_ID = '13sOT5LQ3rEZpRtyLFddn6XQB2BLXYbRb0Tvdig4ve_I';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10s for other requests to finish
  
  try {
    // Open the specific Doc by ID
    var doc = DocumentApp.openById(DOC_ID);
    var body = doc.getBody();
    
    // --- READ MODE (GET) ---
    // If it's a GET request or a POST with action='read'
    if (!e.postData || (e.parameter && e.parameter.action === 'read')) {
      var text = body.getText();
      // Validate if empty
      if (!text || text.trim() === "") {
         return createResponse({ articles: [], directory: [] });
      }
      return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
    }
    
    // --- WRITE MODE (POST) ---
    // Expecting raw JSON body
    if (e.postData) {
      var incomingData = JSON.parse(e.postData.contents);
      
      // Basic validation
      if (incomingData.action === 'sync' && incomingData.data) {
        var newContent = JSON.stringify(incomingData.data, null, 2);
        
        // Overwrite the entire doc content
        body.setText(newContent);
        doc.saveAndClose();
        
        return createResponse({ status: 'success', message: 'Data saved to Google Doc', timestamp: new Date().toISOString() });
      }
    }
    
    return createResponse({ status: 'error', message: 'Invalid request format' });
    
  } catch (error) {
    return createResponse({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}