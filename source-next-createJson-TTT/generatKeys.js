function encryptAccessKey(accessKeyName, accessKeyId) {
  var cipher = new cCryptoGS.Cipher(accessKeyName, 'aes');
  var encryptedMessage = cipher.encrypt(accessKeyId);
  Logger.log(encryptedMessage);
}

function getAccessKeyId(accessKeyName, accessKeyId) {
  var cipher = new cCryptoGS.Cipher(accessKeyName, 'aes');
  var decryptMessage = cipher.decrypt(accessKeyId);
  return decryptMessage;
}
