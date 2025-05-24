const User = require('./models/User');
const bcrypt = require('bcryptjs');

const migrate = async () => {
  const users = await User.find();
  
  for (const user of users) {
    if (!user.password.startsWith('$2a$')) { // Check if not already hashed
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      console.log(`Updated password for ${user.email}`);
    }
  }
  
  console.log('Migration complete!');
};

migrate();