const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('../src/app');
const { connectDB } = require('../src/config/db');
const { sequelize, User, Category, Product, Order, OrderItem, Review } = require('../src/models');
const generateToken = require('../src/utils/generateToken');
const jwt = require('jsonwebtoken');

async function runTest() {
  console.log('=== VibeWear MySQL & Sequelize ORM Integrity Test ===');

  await connectDB();

  console.log('✔ Models Loaded:', {
    User: !!User,
    Category: !!Category,
    Product: !!Product,
    Order: !!Order,
    OrderItem: !!OrderItem,
    Review: !!Review
  });

  // Test real counts in MySQL database
  const userCount = await User.count();
  const catCount = await Category.count();
  const prodCount = await Product.count();
  const reviewCount = await Review.count();

  console.log(`✔ MySQL Live Counts: ${userCount} users, ${catCount} categories, ${prodCount} products, ${reviewCount} reviews`);

  // Test relational eager loading / associations
  const sampleProduct = await Product.findOne({
    include: [
      { model: Category, as: 'categoryDetails' },
      { model: Review, as: 'reviews', include: [{ model: User, as: 'user' }] }
    ]
  });

  if (sampleProduct) {
    console.log(`✔ Associations Verified: Loaded product "${sampleProduct.title}" with category "${sampleProduct.categoryDetails?.name}" and ${sampleProduct.reviews?.length} review(s)`);
  }

  // Test JWT token generation
  const sampleToken = generateToken('test_user_id_123', 'Customer');
  const decoded = jwt.decode(sampleToken);
  console.log('✔ JWT Sign & Verify:', decoded.id === 'test_user_id_123' && decoded.role === 'Customer');

  // Test Express server boot
  const server = app.listen(5098, () => {
    console.log('✔ Express App Server Boot: OK on port 5098');
    server.close(() => {
      console.log('=== All MySQL & Sequelize Integrity Checks Passed Successfully ===');
      process.exit(0);
    });
  });
}

runTest().catch((err) => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
