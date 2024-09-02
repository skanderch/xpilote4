const User = require("../models/User");
const Role = require("../models/Role");
// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, password, role_id } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // No need to hash the password; store it as plain text
    const user = new User({
      username,
      password, // Store password as plain text
      role_id
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role_id");
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // No need to hash the password; update it as plain text
    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate('role_id');

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const roleName = user.role_id.role_name;
    if (roleName !== 'Admin' && roleName !== 'RH') {
      return res.status(403).json({ error: 'Access denied. Not an Admin or RH' });
    }

    res.status(200).json({ 
      message: 'Login successful', 
      username: user.username,
      role: roleName
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};