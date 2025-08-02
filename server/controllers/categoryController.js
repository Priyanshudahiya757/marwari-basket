const Category = require('../models/Category');

// Get all categories (optionally nested)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parent', 'name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, parent, status, seo } = req.body;
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(409).json({ message: 'Category slug already exists' });
    const category = new Category({ name, slug, description, parent, status, seo });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const { name, slug, description, parent, status, seo } = req.body;
    if (slug && slug !== category.slug) {
      const exists = await Category.findOne({ slug });
      if (exists) return res.status(409).json({ message: 'Category slug already exists' });
      category.slug = slug;
    }
    category.name = name || category.name;
    category.description = description || category.description;
    category.parent = parent !== undefined ? parent : category.parent;
    category.status = status || category.status;
    category.seo = seo || category.seo;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.remove();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 