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
    sheet1.setName('GPT4_Acc_Google');
    const sheet2 = spreadsheet.insertSheet('GPT4_Acc_Microsoft');
    const sheet3 = spreadsheet.insertSheet('GPT4_Acc_DeePL');
    const sheet4 = spreadsheet.insertSheet('GPT4_Acc_NICT');

    // If the sheet is empty, write the headers
    if (sheet1.getLastRow() === 0) {
      writeHeaders(sheet1, headerTTT);
      writeHeaders(sheet2, headerTTT);
      writeHeaders(sheet3, headerTTT);
      writeHeaders(sheet4, headerTTT);
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
