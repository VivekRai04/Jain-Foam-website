import bcrypt from 'bcrypt';

const password = 'JainFoam1995';
const hash = '$2b$10$qKfZ.6Lky.T3YPLysdaK5OTp3h3.bhI8nZFQeICFGnRvz1cBe5tFW';

bcrypt.compare(password, hash).then((result) => {
  console.log('Password match:', result);
  process.exit(0);
});
