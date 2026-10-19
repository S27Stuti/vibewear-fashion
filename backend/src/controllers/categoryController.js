const { Category } = require('../models');
const ApiError = require('../utils/apiError');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { targetAudience } = req.query;
    const where = {};

    if (targetAudience) {
      where.targetAudience = targetAudience;
    }

    const categories = await Category.findAll({
      where,
      order: [['name', 'ASC']]
    });

    const formattedCategories = categories.map((c) => ({
      ...c.toJSON(),
      _id: c.id
    }));

    res.status(200).json({
      success: true,
      count: formattedCategories.length,
      data: formattedCategories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new ApiError(`Category not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {
        ...category.toJSON(),
        _id: category.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, targetAudience, image } = req.body;

    if (!name) {
      return next(new ApiError('Please provide a category name', 400));
    }

    const category = await Category.create({
      name,
      description,
      targetAudience: targetAudience || 'Unisex',
      image
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        ...category.toJSON(),
        _id: category.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new ApiError(`Category not found with id ${req.params.id}`, 404));
    }

    await category.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        ...category.toJSON(),
        _id: category.id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new ApiError(`Category not found with id ${req.params.id}`, 404));
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
