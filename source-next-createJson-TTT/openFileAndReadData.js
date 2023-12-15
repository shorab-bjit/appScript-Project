function openFileAndReadData(fileId) {
  if (!fileId) return null;

  // Get the file object.
  const file = DriveApp.getFileById(fileId);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // Check the file type.
  const fileType = file.getMimeType();
  const MIME_TYPE_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  let fileData;
  if (fileType === MimeType.GOOGLE_SHEETS) {
    // For Google Sheets, use SpreadsheetApp to open and read the data.
    const spreadsheet = SpreadsheetApp.openById(fileId);
    const sheet = spreadsheet.getSheets()[0]; // Get the first sheet or specify the sheet you want to read.
    fileData = sheet.getDataRange().getValues();
  } else if (fileType === MIME_TYPE_XLSX) {
    // Retrieve values from XLSX data.
    const data = new Uint8Array(DriveApp.getFileById(fileId).getBlob().getBytes());
    const book = XLSX.read(data, { type: 'array' });
    const sheetName = book.SheetNames[0]; // Replace with the specific sheet name you want to read.
    const worksheet = book.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const values = [];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const row = [];
      let hastData = true;
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cellValue = worksheet[cellRef] ? worksheet[cellRef].v : '';

        if (!cellValue && !C) {
          hastData = false;
          break;
        }
        row.push(cellValue);
      }

      // Only push the row if the loop has not been broken
      if (row.length > 0) {
        values.push(row);
      }
      if (!hastData) break;
    }

    // Now, 'values' contains the data from the XLSX file with empty rows skipped.
    fileData = values;
  } else {
    throw new Error('Unsupported file type: ' + fileType);
  }

  return fileData;
}

function openFileAndReadFirstRowData(fileId) {
  // Get the file object.
  const file = DriveApp.getFileById(fileId);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // Check the file type.
  const fileType = file.getMimeType();
  let fileData;

  if (fileType === MimeType.GOOGLE_SHEETS) {
    const spreadsheet = SpreadsheetApp.openById(fileId);
    const sheet = spreadsheet.getSheets()[0];

    const firstRowData = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    fileData = firstRowData;
  }

  return fileData;
}
