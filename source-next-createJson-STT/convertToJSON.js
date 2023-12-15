function convertToJSON() {
  var longRun = LongRun.instance;
  // funcName must equal this function's name.
  var funcName = 'convertToJSON';

  // you can get the parameters from LongRun class.
  var params = longRun.getParameters(funcName);
  var times = parseInt(params[0]);
  var funcExecutionSeconds = parseInt(params[1]);
  var maxExecutionSeconds = parseInt(params[2]);
  var triggerDelayMinutes = parseInt(params[3]);
  var latestFileId = params[4];
  var myFileName = params[5];

  try {
    data = openFileAndReadData(latestFileId);
    headerRow = data[0];
    engineType = getEngineType(headerRow);
  } catch (error) {
    console.error('An error occurred while reading data or determining engine type: ', error);
    var finished = longRun.end(funcName);
    if (finished) {
      console.log('--- LongRunTask finished. ---');
    }
  }

  longRun.setMaxExecutionSeconds(maxExecutionSeconds); // default is 240 seconds
  longRun.setTriggerDelayMinutes(triggerDelayMinutes); // default is 1 minute
  // you should get the index to resume(zero for the first time)
  var startIndex = longRun.startOrResume(funcName);
  if (startIndex === 0) {
    console.log('--- LongRunTask started. ---');
  }

  try {
    for (let i = startIndex; i < times; i++) {
      const row = data[i + 1];

      if (!row) {
        console.log(`Row ${i + 1} is undefined or null. Skipping.`);
        continue;
      }

      const rowId = `${myFileName}/sl${i + 1}`;
      const jsonObject = { sl: rowId, [`${engineType}_engine`]: [] };

      // Iterate through columns
      for (let j = 0; j < headerRow.length; j++) {
        const key = String(headerRow[j]).toLowerCase();
        var value = String(row[j]);

        if (key !== 'text') {
          value = value
            .replace(/[\(\)]/g, function (match) {
              return match === '(' ? '_' : '';
            })
            .toLowerCase();
        }
        if (key === 'sl') continue;

        if (key === `${engineType}_microsoft`) {
          jsonObject[`${engineType}_engine`].push(value === '1' ? 'microsoft' : '');
        } else if (key === `${engineType}_google`) {
          jsonObject[`${engineType}_engine`].push(value === '1' ? 'google' : '');
        } else if (key === `${engineType}_nict`) {
          jsonObject[`${engineType}_engine`].push(value === '1' ? 'nict' : '');
        } else if (key === `${engineType}_deepl`) {
          jsonObject[`${engineType}_engine`].push(value === '1' ? 'deepl' : '');
        } else {
          jsonObject[key] = value;
        }
      }

      if (longRun.checkShouldSuspend(funcName, i)) {
        // if checkShouldSuspend() returns true, the next trigger has been set
        // and you should get out of the loop.
        console.log('*** The process has been suspended. ***');
        break;
      }

      let retryCount = 3; // Set the number of retry attempts
      let uploadSucceeded = false;

      while (retryCount > 0 && !uploadSucceeded) {
        try {
          const response = uploadFileToS3(myFileName, jsonObject, i + 1);
          if (response == 204) {
            uploadSucceeded = true; // Upload succeeded
            console.log('upload to s3', ' --- ', i + 1);
          } else {
            console.error(`Error uploading file for row ${i}`);
            retryCount--;
          }
        } catch (e) {
          console.error(`Error uploading file for row ${i}: ${e}`);
          retryCount--;
          if (retryCount > 0) {
            console.log(`Retrying upload for row ${i} (${retryCount} attempts left)`);
            Utilities.sleep(funcExecutionSeconds * 500);
          }
        }
      }

      if (!uploadSucceeded) {
        console.error(`Failed to upload file for row ${i} after multiple attempts`);
        // Handle the failure appropriately (e.g., logging, reporting)
        continue;
      }
      Utilities.sleep(funcExecutionSeconds * 50);
    }
  } catch (e) {
    console.error('An error occurred: ' + e);
  } finally {
    // you must always call end() to reset the long-running variables if there is no next trigger.
    var finished = longRun.end(funcName);
    if (finished) {
      console.log('--- LongRunTask finished. ---');
    }
  }
}

function getEngineType(headerRow) {
  const pattern = /(stt|tts|ttt)_(google|nict|microsoft|deeple)/i;
  let matchedPattern = null;
  let matchedEngine = null;

  headerRow.forEach(header => {
    const match = header.match(pattern);
    if (match) {
      matchedPattern = match[0];
      matchedEngine = match[1];
      return;
    }
  });

  return matchedEngine;
}

function getAllSheetNames(fileId) {
  const spreadsheet = SpreadsheetApp.openById(fileId);
  const sheets = spreadsheet.getSheets();
  const sheetNames = sheets.map(sheet => sheet.getName());
  return sheetNames[0].replace(/ /g, '_').toLowerCase();
}
