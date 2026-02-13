const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('❌ Admin user already exists with email: admin@example.com');
      console.log('If you want to create another admin, update the email in the script.');
      process.exit(1);
    }

    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('📧 Email:', admin.email);
    console.log('🔐 Password:', password);
    console.log('👤 Role:', admin.role);
    console.log('\n💡 Next steps:');
    console.log('1. Start your backend server (npm start)');
    console.log('2. Start your frontend (npm run dev)');
    console.log('3. Go to the login page and sign in with the credentials above');
    console.log('4. You will see an "Admin" link in the header');
    console.log('5. Click it to access the admin dashboard!\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();
