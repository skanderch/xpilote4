import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, MenuItem, Box, FormControl, InputLabel, Select
} from '@mui/material';

const AttendanceForm = ({ attendance, onSuccess }) => {
  const [employeeId, setEmployeeId] = useState(attendance?.employee_id || '');
  const [date, setDate] = useState(attendance?.date ? new Date(attendance.date).toISOString().substring(0, 10) : '');
  const [status, setStatus] = useState(attendance?.status || '');
  const [hoursWorked, setHoursWorked] = useState(attendance?.hours_worked || '');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attendanceData = {
      employee_id: employeeId,
      date,
      status,
      hours_worked: hoursWorked,
    };

    try {
      if (attendance) {
        // Edit attendance
        await axios.put(`http://localhost:5000/api/attendances/${attendance._id}`, attendanceData);
      } else {
        // Add new attendance
        await axios.post('http://localhost:5000/api/attendances', attendanceData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Employee</InputLabel>
        <Select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        >
          {employees.map((employee) => (
            <MenuItem key={employee._id} value={employee._id}>
              {employee.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Hours Worked"
        type="number"
        value={hoursWorked}
        onChange={(e) => setHoursWorked(e.target.value)}
        required
      />
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" type="submit">
          {attendance ? 'Update Attendance' : 'Add Attendance'}
        </Button>
      </Box>
    </form>
  );
};

export default AttendanceForm;
