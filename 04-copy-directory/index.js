const fs = require('fs');
const sourcedir = './04-copy-directory/files/';
const destdir = './04-copy-directory/files-copy/';

async function copyDir(from, to) {
  await fs.promises.mkdir(to, { recursive: true }).catch(console.error);

  for(let file of await fs.promises.readdir(from, {withFileTypes: true})){
    const fromFile = from + file.name;
    const toFile = to + file.name;
    if (file.isDirectory()) {
      copyDir(fromFile + '/', toFile + '/');
    }
    else {
      await fs.promises.copyFile(fromFile, toFile, fs.constants.COPYFILE_EXCL);
    }
  }
}

try {
  ( async () => {
    await fs.promises.rmdir(destdir, { recursive: true }).catch(console.error);
    copyDir(sourcedir, destdir);
  })();
} catch {
  console.log('The directory could not be copied');
}