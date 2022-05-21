const fs = require('fs');
const sourcedir = './06-build-page/assets/';
const destdir = './06-build-page/project-dist/assets/';
const path = require('path');
const readline = require('readline');

async function createBundle() {
  const writerFile = fs.createWriteStream('./06-build-page/project-dist/style.css', {flags: 'w'});
  for(let file of await fs.promises.readdir('./06-build-page/styles/', {withFileTypes: true})){
    if (!file.isDirectory()) {
      let f = path.parse(file.name);
      if(f.ext === '.css') {
        const readStream = fs.ReadStream('./06-build-page/styles/' + file.name);
        readStream.on('data', async (chunk) => {
          writerFile.write(chunk);
        });
      }
    }
  }
}

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

async function createHtml() {
  const writerFile = fs.createWriteStream('./06-build-page/project-dist/index.html', {flags: 'w'});
  const readStream = fs.createReadStream('./06-build-page/template.html');
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    const openBrackets = line.indexOf('{{');
    const closeBrackets = line.indexOf('}}');
    if(openBrackets >= 0 && closeBrackets > openBrackets) {
      const fragmentName = line.substring(openBrackets + 2, closeBrackets);
      insertFragment(fragmentName);
    }
    else 
      writerFile.write(line + '\r\n');
  }

  async function insertFragment(file) {
    const readFragment = fs.ReadStream('./06-build-page/components/' + file + '.html');
    readFragment.on('data', async (chunk) => {
      writerFile.write(chunk);
    });
  }
}

try {
  ( async () => {
    await fs.promises.rmdir(destdir, { recursive: true }).catch(console.error);
    await copyDir(sourcedir, destdir);
    await createBundle();
    await createHtml();
  })();
} catch {
  console.log('The directory could not be copied');
}
