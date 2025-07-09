const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-literacy-game';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const username = 'admin';
    const password = 'admin123';
    let admin = await Admin.findOne({ username });
    if (admin) {
      console.log('Admin user already exists:', admin);
    } else {
      admin = new Admin({ username, password });
      await admin.save();
      console.log('Admin user created:', admin);
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error creating admin user:', err);
    mongoose.disconnect();
  }); 