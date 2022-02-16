const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
// const secretKey = 'xgQQdME193stVIIfgIqZZH0JP+s+5wod';

const iv = crypto.randomBytes(16);

const encrypt = function(text, secretKey) {
  console.log("SECRET KEY:"+ secretKey);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + '.' + encrypted.toString('hex');
};

const decrypt = function(hash, secretKey) {
  const content = hash.slice(hash.indexOf(".") + 1);
  const iv = hash.slice(0, hash.indexOf("."));
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

module.exports = { encrypt, decrypt };
