function createResultFile(myFileName) {
  const today = new Date();
  const japanTimeZone = 'Asia/Tokyo';
  const todaysDate = Utilities.formatDate(today, japanTimeZone, 'yyyyMMdd');
  const files = DriveApp.getFolderById(outputFolderId).getFiles();

  const fileName = `${myFileName}_result${todaysDate}`;
  var fileAlreadyExists = false;

  while (files.hasNext()) {
    const file = files.next();
    if (file.getName() === fileName) {
      fileAlreadyExists = true;
      break;
    }
  }

  if (!fileAlreadyExists) {
    // If the spreadsheet doesn't exist, create a new one
    spreadsheet = SpreadsheetApp.create(fileName);
    DriveApp.getFileById(spreadsheet.getId()).moveTo(DriveApp.getFolderById(outputFolderId));

    // Access the new spreadsheet and fill it with dynamic data
    const sheet1 = spreadsheet.getSheets()[0];
    sheet1.setName('Result_WER/CER');

    // Create a second sheet with a different name
    // const sheet2 = spreadsheet.insertSheet('STT_Result_CER');

    // If the sheet is empty, write the headers
    if (sheet1.getLastRow() === 0) {
      writeHeaders(sheet1, headers_wer);
      // writeHeaders(sheet2, headers_cer);
    }
    // Return the file ID
    return {
      fileId: spreadsheet.getId(),
      fileName: spreadsheet.getName(),
    };
  } else {
    return null;
  }
}

function writeHeaders(sheet, headers) {
  const headerRow = sheet.getRange(1, 1, 1, headers.length);
  headerRow.setValues([headers]);
  headerRow.setBackground('#56c477');
  headerRow.setFontColor('white');
  headerRow.setFontSize(12);
  headerRow.setHorizontalAlignment('center');
}
