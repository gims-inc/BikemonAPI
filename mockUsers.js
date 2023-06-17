const sha1 = require('sha1');

const mongoose = require('mongoose');
const User = require('./models/user'); // Import the User model

// Generate 20 users
const generateUsers = async () => {
  const users = [];
  for (let i = 0; i < 20; i++) {
    const user = new User({
      userName: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: sha1('password123'),
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      image: '',
      designation: 'rider',
    });
    users.push(user);
  }
  await User.insertMany(users);
  console.log('Users created successfully!');
};

mongoose.connect('mongodb://localhost:27017/bikemon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    generateUsers()
      .then(() => {
        mongoose.connection.close();
      })
      .catch((error) => {
        console.error(error);
        mongoose.connection.close();
      });
  })
  .catch((error) => {
    console.error(error);
  });
