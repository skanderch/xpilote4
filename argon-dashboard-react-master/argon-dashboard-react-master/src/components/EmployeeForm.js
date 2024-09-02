import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Box, MenuItem } from '@mui/material';

const EmployeeForm = ({ employee, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [productionSite, setProductionSite] = useState(''); // New state for production_site

  // Initialize form fields with existing employee data
  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setPosition(employee.position);
      setHireDate(new Date(employee.hire_date).toISOString().split('T')[0]);
      setStatus(employee.status);
      setProductionSite(employee.production_site || ''); // Initialize state
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await axios.put(`http://localhost:5000/api/employees/${employee._id}`, { 
          name, 
          email, 
          position, 
          hire_date: hireDate, 
          status, 
          production_site: productionSite // Include production_site
        });
      } else {
        await axios.post('http://localhost:5000/api/employees', { 
          name, 
          email, 
          position, 
          hire_date: hireDate, 
          status, 
          production_site: productionSite // Include production_site
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Position"
        margin="normal"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Hire Date"
        margin="normal"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={hireDate}
        onChange={(e) => setHireDate(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Status"
        margin="normal"
        select
        SelectProps={{ native: true }}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </TextField>
      <TextField
        fullWidth
        label="Production Site" // New field
        margin="normal"
        select
        SelectProps={{ native: true }}
        value={productionSite}
        onChange={(e) => setProductionSite(e.target.value)}
        required
      >
        <option value="" disabled>Select Production Site</option>
        <option value="Paris">Paris</option>
        <option value="Tunis">Tunis</option>
        <option value="Beyrouth">Beyrouth</option>
        <option value="Madagascar">Madagascar</option>
      </TextField>
      <Box mt={2}>
        <Button variant="contained" color="primary" type="submit">
          {employee ? 'Update Agent' : 'Add Agent'}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeForm;
