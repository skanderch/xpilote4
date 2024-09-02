const express = require('express');
const router = express.Router();
const { registerUser, getUsers, updateUser, deleteUser, loginUser } = require('../controllers/userController');

// User Routes
router.get('/users', getUsers); // Ensure getUsers is defined and exported
router.post('/users', registerUser); // Ensure registerUser is defined and exported
router.put('/users/:id', updateUser); // Ensure updateUser is defined and exported
router.delete('/users/:id', deleteUser); // Ensure deleteUser is defined and exported

// Authentication Routes
router.post('/login', loginUser); // Ensure loginUser is defined and exported

module.exports = router;
