// In-memory product store
let products = [
  { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', stock: 15 },
  { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories', stock: 100 },
  { id: 3, name: 'USB-C Hub', price: 49.99, category: 'Accessories', stock: 50 }
];

let nextId = 4;

const getAllProducts = (req, res) => {
  const { category } = req.query;
  let result = products;
  if (category) {
    result = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ success: true, data: result, count: result.length });
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
};

const createProduct = (req, res) => {
  const { name, price, category, stock } = req.body;
  if (!name || price === undefined || !category) {
    return res.status(400).json({ success: false, error: 'Name, price, and category are required' });
  }
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, error: 'Price must be a valid positive number' });
  }
  const newProduct = { id: nextId++, name, price: parseFloat(price), category, stock: stock || 0 };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
};

const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body, id };
  res.json({ success: true, data: products[index] });
};

const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  products.splice(index, 1);
  res.json({ success: true, message: 'Product deleted successfully' });
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
