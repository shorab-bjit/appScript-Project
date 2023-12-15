function uploadFileToS3(myFileName, jsonString, rowId) {
  try {
    const date = new Date();
    const japanTimeZone = 'Asia/Tokyo'; // Time zone ID for Japan
    const formattedDate = Utilities.formatDate(date, japanTimeZone, 'yyyyMMdd');

    var file = JSON.stringify(jsonString);
    const fileName = `${myFileName}_${formattedDate}_${rowId}.json`;

    const s3 = new S3HttpPost(accessKeyId, secretAccessKey, bucket, region);
    const myJsonFile = Utilities.newBlob(file, 'application/json', fileName);

    // upload file and get the response
    const uploadResponse = s3.upload(myJsonFile);

    // Return the response from the upload function
    return uploadResponse.getResponseCode();
  } catch (e) {
    // Return an error message
    return 404;
  }
}
