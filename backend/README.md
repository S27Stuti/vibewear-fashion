# VibeWear Backend API (MySQL & Sequelize ORM)

High-performance, relational RESTful API built with **Node.js**, **Express**, **MySQL**, and **Sequelize ORM** for the VibeWear e-commerce platform (Men, Women, Kids apparel).

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MySQL Sequelize connection & database pre-flight
│   ├── models/
│   │   ├── index.js              # Relational Associations & Review hooks
│   │   ├── User.js               # UUID PK, Bcrypt hooks, Role ('Customer' | 'Admin')
│   │   ├── Category.js           # UUID PK, slug generation, TargetAudience ENUM
│   │   ├── Product.js            # UUID PK, JSON sizes/colors/images, categoryId FK
│   │   ├── Order.js              # UUID PK, userId FK, JSON address, payment & order status
│   │   ├── OrderItem.js          # UUID PK, orderId FK, productId FK, line item pricing
│   │   └── Review.js             # UUID PK, userId FK, productId FK, composite unique index
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile with Sequelize
│   │   ├── categoryController.js # Categories CRUD operations
│   │   ├── productController.js  # Products CRUD, Op filtering, search, pagination
│   │   ├── orderController.js    # ACID transaction order placement & stock updates
│   │   └── reviewController.js   # Product reviews with automatic rating aggregation
│   ├── routes/
│   │   ├── authRoutes.js         # /api/v1/auth
│   │   ├── categoryRoutes.js     # /api/v1/categories
│   │   ├── productRoutes.js      # /api/v1/products (with nested reviews)
│   │   ├── orderRoutes.js        # /api/v1/orders
│   │   └── reviewRoutes.js       # /api/v1/reviews
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification (`User.findByPk`) & RBAC
│   │   └── errorMiddleware.js    # SequelizeUniqueConstraint & ValidationError handler
│   ├── utils/
│   │   ├── apiError.js           # Operational error class
│   │   └── generateToken.js      # JWT signing helper
│   ├── app.js                    # Express app configuration & middlewares
│   ├── server.js                 # Server entrypoint with `sequelize.sync()`
│   └── seeder.js                 # MySQL Database seeder script
├── tests/
│   └── quickTest.js              # Automated MySQL & Sequelize smoke test
├── .env.example                  # Environment configuration template
├── .env                          # Local environment variables
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/) (Version 8.0+)

### 2. Environment Configuration
Copy `.env.example` to `.env` and set your MySQL credentials:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_NAME=vibewear
DB_USER=root
DB_PASSWORD=1234
DB_HOST=127.0.0.1
DB_PORT=3306

JWT_SECRET=super_secret_vibewear_jwt_key_2026_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Database (MySQL)
Automatically drops previous tables, creates fresh relational schemas, inserts categories, admin & customer users, and products for Men, Women, and Kids:
```bash
npm run seed
```

### 5. Run Integrity Test
```bash
npm test
```

### 6. Run the Server
Development mode (auto-reload with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

---

## 🔗 Relational Schema & Associations

- **User ➔ Orders**: 1-to-Many (`User.hasMany(Order, { foreignKey: 'userId' })`)
- **Order ➔ OrderItems**: 1-to-Many (`Order.hasMany(OrderItem, { foreignKey: 'orderId' })`)
- **Product ➔ OrderItems**: 1-to-Many (`Product.hasMany(OrderItem, { foreignKey: 'productId' })`)
- **User ➔ Reviews**: 1-to-Many (`User.hasMany(Review, { foreignKey: 'userId' })`)
- **Product ➔ Reviews**: 1-to-Many (`Product.hasMany(Review, { foreignKey: 'productId' })`)
- **Category ➔ Products**: 1-to-Many (`Category.hasMany(Product, { foreignKey: 'categoryId' })`)

### Automatic Hook on Reviews
Sequelize lifecycle hooks on the `Review` model (`afterCreate`, `afterUpdate`, `afterDestroy`) automatically execute an aggregation query and update the associated `Product`'s `rating` and `numReviews` fields in MySQL.
