function convertExcelToGoogleSheet() {
  const { latestFileId } = getLatestFile(parentInputFolderId);

  // Get the file object.
  let file = DriveApp.getFileById(latestFileId);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileType = file.getMimeType();
  const MIME_TYPE_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  if (fileType === MIME_TYPE_XLSX) {
    var name = file.getName();

    const date = new Date();
    const japanTimeZone = 'Asia/Tokyo'; // Time zone ID for Japan
    const formattedTime = Utilities.formatDate(date, japanTimeZone, 'HHmmss');

    if (name.indexOf('.xlsx') > -1) {
      var ID = file.getId();
      var xBlob = file.getBlob();
      var newFile = {
        title: name.replace(/\.xlsx$/, `_V${formattedTime}`),
        parents: [{ id: parentInputFolderId }], //  Added
      };
      file = Drive.Files.insert(newFile, xBlob, {
        convert: true,
      });
      Drive.Files.remove(ID); // Added // If this line is run, the original XLSX file is removed. So please be careful this.
    }
  }
}
