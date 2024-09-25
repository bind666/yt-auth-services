import fs from 'fs';
import path from 'path';
import rsaPemToJwk from 'rsa-pem-to-jwk';

var pem = fs.readFileSync('./certs/private_key.pem');
var jwk = rsaPemToJwk(pem, { use: 'sig' }, 'public');

console.log(JSON.stringify(jwk));
// console.log(jwk);
