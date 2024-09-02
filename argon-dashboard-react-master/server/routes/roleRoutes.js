const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new role
router.post('/roles', async (req, res) => {
  const { role_name } = req.body;

  try {
    const newRole = new Role({ role_name });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a role
router.put('/roles/:id', async (req, res) => {
  const { id } = req.params;
  const { role_name } = req.body;

  try {
    const updatedRole = await Role.findByIdAndUpdate(id, { role_name }, { new: true });
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a role
router.delete('/roles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Role.findByIdAndDelete(id);
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
