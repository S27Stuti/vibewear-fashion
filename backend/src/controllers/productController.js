const { Op } = require('sequelize');
const { Product, Category, Review, User } = require('../models');
const ApiError = require('../utils/apiError');

// @desc    Get all products with advanced filtering, search, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      subCategory,
      keyword,
      minPrice,
      maxPrice,
      size,
      color,
      rating,
      inStock,
      isFeatured,
      sort,
      page = 1,
      limit = 150
    } = req.query;

    const where = {};

    // Filter by Category ('Men', 'Women', 'Kids')
    if (category) {
      if (Array.isArray(category)) {
        where.category = { [Op.in]: category };
      } else {
        where.category = category;
      }
    }

    // Filter by SubCategory
    if (subCategory) {
      where.subCategory = { [Op.like]: `%${subCategory}%` };
    }

    // Keyword Search across title and description
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // Price Range Filter using Op.gte & Op.lte
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price[Op.gte] = Number(minPrice);
      if (maxPrice !== undefined) where.price[Op.lte] = Number(maxPrice);
    }

    // Minimum Rating Filter
    if (rating) {
      where.rating = { [Op.gte]: Number(rating) };
    }

    // Stock Filter
    if (inStock === 'true') {
      where.stock = { [Op.gt]: 0 };
    }

    // Featured Filter
    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    // Sorting
    let order = [['createdAt', 'DESC']]; // default: newest first
    if (sort) {
      switch (sort) {
        case 'price-asc':
          order = [['price', 'ASC']];
          break;
        case 'price-desc':
          order = [['price', 'DESC']];
          break;
        case 'rating-desc':
          order = [['rating', 'DESC']];
          break;
        case 'oldest':
          order = [['createdAt', 'ASC']];
          break;
        case 'title-asc':
          order = [['title', 'ASC']];
          break;
        default:
          order = [['createdAt', 'DESC']];
      }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(250, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    // Query MySQL via Sequelize findAndCountAll
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'categoryDetails',
          attributes: ['id', 'name', 'slug', 'targetAudience']
        }
      ],
      order,
      limit: limitNum,
      offset,
      distinct: true
    });

    // In-memory filter for JSON array fields (sizes, colors) if requested
    let filteredProducts = rows.map((p) => {
      const json = p.toJSON();
      return {
        ...json,
        _id: json.id // For backward compatibility with frontend
      };
    });

    if (size) {
      const sizesArray = (Array.isArray(size) ? size : size.split(',')).map((s) => s.trim().toLowerCase());
      filteredProducts = filteredProducts.filter((p) =>
        Array.isArray(p.sizes) && p.sizes.some((s) => sizesArray.includes(String(s).toLowerCase()))
      );
    }

    if (color) {
      const colorsArray = (Array.isArray(color) ? color : color.split(',')).map((c) => c.trim().toLowerCase());
      filteredProducts = filteredProducts.filter((p) =>
        Array.isArray(p.colors) && p.colors.some((c) => colorsArray.some((target) => String(c).toLowerCase().includes(target)))
      );
    }

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      pagination: {
        total: count,
        page: pageNum,
        pages: Math.ceil(count / limitNum) || 1,
        limit: limitNum,
        hasNextPage: pageNum * limitNum < count,
        hasPrevPage: pageNum > 1
      },
      data: filteredProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'categoryDetails',
          attributes: ['id', 'name', 'slug', 'targetAudience']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!product) {
      return next(new ApiError(`Product not found with id ${req.params.id}`, 404));
    }

    const json = product.toJSON();

    res.status(200).json({
      success: true,
      data: {
        ...json,
        _id: json.id,
        reviews: (json.reviews || []).map((r) => ({
          ...r,
          _id: r.id
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      category,
      categoryId,
      subCategory,
      sizes,
      colors,
      images,
      stock,
      isFeatured
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      categoryId: categoryId || null,
      subCategory: subCategory || 'General',
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      colors: Array.isArray(colors) ? colors : [colors],
      images: Array.isArray(images) ? images : [images],
      stock: Number(stock) || 0,
      isFeatured: Boolean(isFeatured)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...product.toJSON(),
        _id: product.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new ApiError(`Product not found with id ${req.params.id}`, 404));
    }

    await product.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        ...product.toJSON(),
        _id: product.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return next(new ApiError(`Product not found with id ${req.params.id}`, 404));
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
