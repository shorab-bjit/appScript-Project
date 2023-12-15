function globalVariable() {
  const inputFolderId = '1lkl9TLUTmQX1B3ZJlwqnPJKhJVe523Lj';
  const outputFolderId = '1_omTTGRqnBQk9cGHq3Tqu5jxIrlRFD95';
  const bucketName = 'pt-test-automation-stt-input-bucket';
  const accessKeyId = getAccessKeyId('accessKeyId', 'U2FsdGVkX1+A+HYHmwiL3udpo9R9t4cdZBjoEdrZX4fSgfVeSgAFkI+WFhvao5UN');
  const secretAccessKey = getAccessKeyId('secretAccessKeyId', 'U2FsdGVkX1/d3hhZh5RInVvCtxejJKUQAN20Smj8ZMx6N+m+UAqO7Wc0Icd7jOkEK+kf/iSYUfQVoyx30vl4jw==');
  const region = 'ap-northeast-1';
  const acl = 'private';

  const headers_wer = [
    'sl',
    'language_name',
    'text',
    'tts_engine',
    'tts_status',
    'stt_microsoft',
    'stt_microsoft_status',
    'stt_google',
    'stt_google_status',
    'stt_nict',
    'stt_nict_status',
    'acc_microsoft_wer',
    'acc_google_wer',
    'acc_nict_wer',
    'acc_microsoft_cer',
    'acc_google_cer',
    'acc_nict_cer',
    'audio_url',
  ];
  // const headers_cer = [...commonHeaders, 'acc_microsoft_cer', 'acc_google_cer'];

  const scriptProperties = PropertiesService.getScriptProperties();

  // Set each variable in the script properties
  scriptProperties.setProperty('inputFolderId', inputFolderId); // Use "inputFolderId" here
  scriptProperties.setProperty('outputFolderId', outputFolderId);
  scriptProperties.setProperty('bucketName', bucketName);
  scriptProperties.setProperty('accessKeyId', accessKeyId);
  scriptProperties.setProperty('secretAccessKey', secretAccessKey);
  scriptProperties.setProperty('region', region);
  scriptProperties.setProperty('acl', acl);
  scriptProperties.setProperty('headers_wer', JSON.stringify(headers_wer));
  // scriptProperties.setProperty('headers_cer', JSON.stringify(headers_cer));
}
