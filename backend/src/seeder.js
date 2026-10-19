const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('./config/db');
const { sequelize, User, Category, Product, Order, OrderItem, Review } = require('./models');
const { sampleCategories, sampleProducts } = require('./data/productsData');

const sampleUsers = [
  {
    name: 'Admin VibeWear',
    email: 'admin@vibewear.com',
    password: 'Password123!',
    role: 'Admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!',
    role: 'Customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Password123!',
    role: 'Customer'
  }
];

const seedData = async () => {
  try {
    console.log('🔄 Connecting to MySQL database...');
    await connectDB();

    console.log('🗑️  Clearing existing records (Syncing database)...');
    await sequelize.sync({ force: true });

    console.log('🌱 Seeding Categories...');
    const createdCategories = await Category.bulkCreate(sampleCategories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.targetAudience] = cat.id;
    });

    console.log('🌱 Seeding Users (with password hashing hook)...');
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    console.log('🌱 Seeding Products (with Category associations)...');
    const productsWithCategory = sampleProducts.map((p) => {
      const { id, _id, ...rest } = p;
      return {
        ...rest,
        categoryId: categoryMap[p.category] || null
      };
    });

    const createdProducts = await Product.bulkCreate(productsWithCategory);
    console.log(`✅ Successfully seeded ${createdProducts.length} clothing products!`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    if (error.original) {
      console.error('MySQL details:', error.original.message);
    }
    process.exit(1);
  }
};

seedData();
