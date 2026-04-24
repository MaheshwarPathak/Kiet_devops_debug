// In-memory user store
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user' }
];

let nextId = 4;

const getAllUsers = (req, res) => {
  res.json({ success: true, data: users, count: users.length });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
};

const createUser = (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }
  const emailExists = users.find(u => u.email === email);
  if (emailExists) {
    return res.status(409).json({ success: false, error: 'Email already exists' });
  }
  const newUser = { id: nextId++, name, email, role: role || 'user' };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  users[index] = { ...users[index], ...req.body, id };
  res.json({ success: true, data: users[index] });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  users.splice(index, 1);
  res.json({ success: true, message: 'User deleted successfully' });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
