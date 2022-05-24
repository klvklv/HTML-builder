const fs = require('fs');
const readStream = fs.ReadStream('01-read-file\\text.txt');

readStream.on('data', (chunk) => {
  console.log (chunk.toString());
});
