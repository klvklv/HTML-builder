const fs = require('fs');
const path = require('path');

async function createBundle() {
  const writerFile = fs.createWriteStream('05-merge-styles\\project-dist\\bundle.css', {flags: 'w'});
  for(let file of await fs.promises.readdir('05-merge-styles\\styles\\', {withFileTypes: true})){
    if (!file.isDirectory()) {
      let f = path.parse(file.name);
      if(f.ext === '.css') {
        const readStream = fs.ReadStream('05-merge-styles\\styles\\' + file.name);
        readStream.on('data', async (chunk) => {
          writerFile.write(chunk);
        });
      }
    }
  }
}
 
try {
  ( async () => {
    await createBundle();
  })();
}
catch {
  console.log('Bundle was not created');
}
