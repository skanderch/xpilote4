const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Get all employees
router.get('/employees', employeeController.getEmployees);

// Get a single employee by ID
router.get('/employees/:id', employeeController.getEmployeeById);

// Create a new employee
router.post('/employees', employeeController.createEmployee);

// Update an employee
router.put('/employees/:id', employeeController.updateEmployee);

// Delete an employee
router.delete('/employees/:id', employeeController.deleteEmployee);

module.exports = router;
