// --- CONFIGURATION ---
// 1. Run the 'setup' function once to create the database document.
// 2. Deploy as Web App -> Execute as: Me -> Access: Anyone.

function setup() {
  // Check if we already have a doc id saved
  var props = PropertiesService.getScriptProperties();
  var docId = props.getProperty('DB_DOC_ID');
  
  if (!docId) {
    // Create a new Google Doc to act as our JSON database
    var doc = DocumentApp.create('SHK_CMS_Database_DO_NOT_DELETE');
    var body = doc.getBody();
    
    // Initialize with empty valid JSON structure
    var initialData = {
      articles: [],
      directory: [],
      lastUpdated: new Date().toISOString()
    };
    
    body.setText(JSON.stringify(initialData, null, 2));
    
    // Save the ID for future use
    props.setProperty('DB_DOC_ID', doc.getId());
    
    Logger.log('SUCCESS! Database Doc created. ID: ' + doc.getId());
    Logger.log('File Name: SHK_CMS_Database_DO_NOT_DELETE');
  } else {
    Logger.log('Setup already complete. Doc ID: ' + docId);
  }
}

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
    var props = PropertiesService.getScriptProperties();
    var docId = props.getProperty('DB_DOC_ID');
    
    if (!docId) {
      return createResponse({ status: 'error', message: 'Database not setup. Run setup() function in script editor.' });
    }
    
    var doc = DocumentApp.openById(docId);
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