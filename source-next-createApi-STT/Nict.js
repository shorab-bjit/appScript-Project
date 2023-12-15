let isProcess = false;
const outputFolderId = '1_omTTGRqnBQk9cGHq3Tqu5jxIrlRFD95';
const headers_STT = ['sl', 'language_name', 'text', 'tts_engine', 'tts_status', 'stt_microsoft', 'stt_microsoft_status', 'stt_google', 'stt_google_status', 'acc_microsoft_wer', 'acc_google_wer', 'acc_microsoft_cer', 'acc_google_cer', 'audio_url'];

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
    const parts = requestData.sl.split('/');
    const slNumber = Number(parts[1].replace('sl', ''));

    // Regular expression to match the last 'sl' and its value
    const regex = /sl(\d+)$/;
    const match = requestData.sl.match(regex);
    if (match) {
      const extractedValue = match[1];
      requestData.sl = extractedValue;
    }

    const spreadsheet = openSpreadsheet(parts[0]);
    const sheet1 = spreadsheet.getSheets()[0];
    // const sheet2 = spreadsheet.getSheets()[1];

    const rowNumber = slNumber + 1;
    await writeValues(sheet1, headers_STT, requestData, rowNumber);
    // await writeValues(sheet2, headers_cer, requestData, rowNumber);

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
  const range = sheet.getRange(rowNumber, 1, 1, headers.length);

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
