const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('VinQ@Admin2024!', 12);
console.log('Password hash:', hash);
