function uploadFile(data) {
  try {
    const myFile = Utilities.newBlob(Utilities.base64Decode(data.data), data.mimeType, data.fileName);
    const folder = DriveApp.getFolderById(parentInputFolderId);
    const fileAdded = folder.createFile(myFile);

    const rep = {
      url: fileAdded.getUrl(),
      name: data.fileName,
    };

    return rep;
  } catch (error) {
    console.error('An error occurred during file upload:', error);
    throw error;
  }
}
