import bcrypt from 'bcrypt';

const password = 'JainFoam1995';
const hash = '$2b$10$qKfZ.6Lky.T3YPLysdaK5OTp3h3.bhI8nZFQeICFGnRvz1cBe5tFW';

console.log('Testing password:', password);
console.log('Testing hash:', hash);
console.log('');

bcrypt.compare(password, hash).then((result) => {
  console.log('Result:', result);
  if (result) {
    console.log('SUCCESS: Password matches!');
  } else {
    console.log('FAILED: Password does not match');
  }
  process.exit(0);
});
