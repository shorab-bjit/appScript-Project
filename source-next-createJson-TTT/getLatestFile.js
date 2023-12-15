function getLatestFile(inputFolderId, fileNamePrefix = '') {
  try {
    const theFolder = DriveApp.getFolderById(inputFolderId);
    const files = theFolder.getFiles();

    if (!files.hasNext()) {
      return null;
    }

    let latestFile = null;
    let latestModifiedDate = new Date(0); // Initialize to a very old date

    while (files.hasNext()) {
      const file = files.next();
      const modifiedDate = file.getLastUpdated();
      const fileName = file.getName();
      const mimeType = file.getMimeType();

      // Check if the file is a Google Sheets or XLSX file
      if ((mimeType === 'application/vnd.google-apps.spreadsheet' || mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') && (fileNamePrefix === '' || fileName.startsWith(fileNamePrefix)) && modifiedDate > latestModifiedDate) {
        latestFile = file;
        latestModifiedDate = modifiedDate;
      }
    }

    if (latestFile === null) {
      return null;
    }

    const latestFileId = latestFile.getId();
    const latestFileName = latestFile.getName();

    return {
      latestFileId,
      latestFileName,
    };
  } catch (error) {
    console.error('Error in getLatestFile:', error);
    return null;
  }
}
