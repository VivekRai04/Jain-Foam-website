import bcrypt from 'bcrypt';

const password = 'JainFoam1995';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log('Hash:', hash);
  process.exit(0);
});
