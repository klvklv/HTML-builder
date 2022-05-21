const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });
const writer = fs.createWriteStream('02-write-file\\test.txt', {flags: 'a'});

console.log('Now you may type smtn');

function bye () {
  console.log('Bye, see you later');
  writer.close((err) => {
    if(err) throw err;
  });
  rl.close();
}

rl.on('SIGINT', () => {
  bye();
});

rl.on('line', (input) => {
  if( input === 'exit') bye();
  else writer.write(input + '\r\n');
});

