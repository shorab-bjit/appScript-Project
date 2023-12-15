// Initialize global variables and script properties
globalVariable();
const scriptProperties = PropertiesService.getScriptProperties();

// Retrieve script properties
const region = scriptProperties.getProperty('region');
const bucket = scriptProperties.getProperty('bucketName');
const accessKeyId = scriptProperties.getProperty('accessKeyId');
const secretAccessKey = scriptProperties.getProperty('secretAccessKey');

const outputFolderId = scriptProperties.getProperty('outputFolderId');
const parentInputFolderId = scriptProperties.getProperty('inputFolderId');
const headers_wer = JSON.parse(scriptProperties.getProperty('headers_wer'));

// Main function for processing STT (Speech to text) data
async function mainSTT(callFromWeb = false, inputFileName = '') {
  try {
    // Check if the function is called from the web
    if (callFromWeb === true) {
      // If called from the web, get the latest file information and read its data
      const { latestFileId, latestFileName } = await getLatestFile(parentInputFolderId, inputFileName);
      const data = openFileAndReadData(latestFileId);

      // Set parameters for the long-running process and initiate it
      var params = getProcessParameters(data.length, latestFileId, latestFileName);
      LongRun.instance.setParameters('convertToJSON', params);
      convertToJSON();
    } else {
      // If not called from the web, perform initial processing steps
      convertExcelToGoogleSheet();
      const { latestFileId, latestFileName } = await getLatestFile(parentInputFolderId);
      const isResultFileExists = await createResultFile(latestFileName);

      if (latestFileId && latestFileName && isResultFileExists) {
        const data = openFileAndReadData(latestFileId);

        var params = getProcessParameters(data.length, latestFileId, latestFileName);
        LongRun.instance.setParameters('convertToJSON', params);
        convertToJSON();
      } else {
        Logger.log('No files found in the folder or it is already executed today!');
      }
    }
  } catch (error) {
    // Handle the exception, log an error message, or take appropriate action.
    Logger.log('An error occurred in the main function: ' + error);
  }
}

// Function to get parameters for the long-running process
function getProcessParameters(dataLength, latestFileId, latestFileName) {
  return [dataLength, 1, 300, 1, latestFileId, latestFileName];

  //1. How many times the process should be executed
  //2. How long does it take to process one case? (in seconds)
  //3. Maximum acceptable run time in seconds (less than 6 minutes, of course)
  //4. How many minutes later the next trigger will be activated
  //5. The latest file ID
  //6. The latest file name
}

// Function to generate a result file
async function generateResultFile(uploadFileName = '') {
  let fileId = '';

  try {
    await convertExcelToGoogleSheet();
    const { latestFileId, latestFileName } = await getLatestFile(parentInputFolderId, uploadFileName);
    fileId = latestFileId;
    const data = openFileAndReadFirstRowData(latestFileId);
    const engineType = getEngineType(data);

    if (engineType !== 'stt') {
      Drive.Files.remove(fileId);
      return null;
    }

    const resultFile = await createResultFile(latestFileName);
    return resultFile;
  } catch (error) {
    Logger.log('An error occurred to generate result file: ' + error);
    Drive.Files.remove(fileId);
    return null;
  }
}

// Function for handling HTTP GET requests
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}
