const bcrypt = require('bcrypt');

bcrypt.hash('Sahid@0512', 10).then((hash) => {
  console.log("Hashed Password:", hash);
});
