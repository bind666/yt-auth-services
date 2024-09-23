import { generateKeyPairSync } from 'crypto';
import fs from 'fs';

// Function to generate keys
function generateKeyPair() {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // The length of the key in bits
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  fs.writeFileSync('../certs/private_key.pem', privateKey);
  fs.writeFileSync('../certs/public_key.pem', publicKey);

  return { privateKey, publicKey };
}

generateKeyPair();
