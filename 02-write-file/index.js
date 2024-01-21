const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const sayGoodBye = () => console.log('Bye!');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeStream = fs.createWriteStream(filePath);

rl.on('line', (input) => {
  const isExit = String(input).trim() === 'exit';
  if (isExit) {
    sayGoodBye();
    rl.close();
    return;
  }
  writeStream.write(input + '\n');
});

rl.on('SIGINT', () => {
  sayGoodBye();
  process.exit();
});

console.log('Please write something:');
