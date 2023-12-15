let isProcess = false;
const outputFolderId = '1HFO0uiJDVyOEuEJFf5I4IS9rP6WXVjuq';

const headerTTT = [
  'sl',
  'source_language',
  'original_text',
  'target_language',
  'translate_text',
  'status',
  'gpt_status',
  'accuracy_score',
  'accuracy_comment',
  'clarity_score',
  'clarity_comments',
  'consistency_score',
  'consistency_comments',
  'cultural_appropriateness_score',
  'cultural_appropriateness_comments',
  'grammar_and_syntax_score',
  'grammar_and_syntax_comment',
  'style_and_tone_score',
  'style_and_tone_comments',
  'flow_and_readability_score',
  'flow_and_readability_comments',
  'naturalness_score',
  'naturalness_comment',
  'completeness_score',
  'completeness_comments',
  'audience_appropriateness_score',
  'audience_appropriateness_comments',
  'improved_translation_result',
];

async function doPost(e) {
  if (e.postData.type === 'application/json') {
    const requestData = JSON.parse(e.postData.contents);
    const result = await processRequest(requestData);

    // Return a response immediately, without blocking the API call.
    return ContentService.createTextOutput(JSON.stringify({ message: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ message: 'failed' })).setMimeType(ContentService.MimeType.JSON);
  }
}

async function processRequest(requestData) {
  try {
    console.log('Processing request:', requestData);

    const parts = requestData.sl.split('/');
    const spreadsheet = openSpreadsheet(parts[0]);
    const sheet1 = spreadsheet.getSheets()[0];
    const sheet2 = spreadsheet.getSheets()[1];
    const sheet3 = spreadsheet.getSheets()[2];
    const sheet4 = spreadsheet.getSheets()[3];

    if (requestData.ttt_google) {
      await writeValues(sheet1, headerTTT, requestData.ttt_google, requestData.ttt_google.sl);
    }
    if (requestData.ttt_microsoft) {
      await writeValues(sheet2, headerTTT, requestData.ttt_microsoft, requestData.ttt_microsoft.sl);
    }
    if (requestData.ttt_deepl) {
      await writeValues(sheet3, headerTTT, requestData.ttt_deepl, requestData.ttt_deepl.sl);
    }
    if (requestData.ttt_nict) {
      await writeValues(sheet4, headerTTT, requestData.ttt_nict, requestData.ttt_nict.sl);
    }

    return {
      message: 'Data received and processed successfully.',
    };
  } catch (error) {
    return {
      message: 'Error: ' + error,
    };
  }
}

function openSpreadsheet(fileName) {
  const today = new Date();
  const japanTimeZone = 'Asia/Tokyo';
  const todaysDate = Utilities.formatDate(today, japanTimeZone, 'yyyyMMdd');
  const fileIterator = DriveApp.getFolderById(outputFolderId).getFilesByName(`${fileName}_result${todaysDate}`);
  let spreadsheet;

  if (fileIterator.hasNext()) {
    spreadsheet = SpreadsheetApp.open(fileIterator.next());
  }
  return spreadsheet;
}

function writeValues(sheet, headers, data, rowNumber) {
  const range = sheet.getRange(rowNumber + 1, 1, 1, headers.length);

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const newValue = data[header];

    if (newValue !== undefined && newValue !== '') {
      // Update the specific column if the new value are not empty
      range.getCell(1, i + 1).setValue(newValue);
    }
  }

  return {
    message: 'success',
    row: data.sl,
  };
}
