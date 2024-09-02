import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  TextField,
  Paper,
  Modal,
  Fade,
  Backdrop,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AttendanceList = () => {
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState({
    status: "",
    hoursWorked: 0,
    reason: "",
    name: "",
    email: "",
    position: "",
    hireDate: "",
  
    productionSite: ""
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendances();
  }, [selectedDate]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, []);

  const fetchAttendances = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/attendances");
      setAttendances(response.data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    }
  }, []);

  const handleStatusUpdate = async (employee, status, hoursWorked, reason) => {
    try {
      const existingAttendance = attendances.find(
        (att) =>
          att.employee_id &&
          att.employee_id._id === employee._id &&
          dayjs(att.date).isSame(selectedDate, "day")
      );
  
      if (existingAttendance) {
        await axios.put(
          `http://localhost:5000/api/attendances/${existingAttendance._id}`,
          { status, hours_worked: hoursWorked, reason }
        );
      } else {
        await axios.post("http://localhost:5000/api/attendances", {
          employee_id: employee._id,
          date: selectedDate,
          status,
          hours_worked: hoursWorked,
          reason,
        });
      }
  
      // Fetch and update the state
      fetchAttendances();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleOpen = async (employee) => {
    try {
      // Fetch the full employee details
      const response = await axios.get(`http://localhost:5000/api/employees/${employee._id}`);
      const employeeDetails = response.data;

      // Fetch the attendance record for the selected employee and date
      const employeeAttendance = attendances.find(
        (att) =>
          att.employee_id &&
          att.employee_id._id === employee._id &&
          dayjs(att.date).isSame(selectedDate, "day")
      );

      setEmployeeDetails({
        name: employeeDetails.name,
        email: employeeDetails.email,
        position: employeeDetails.position,
        hireDate: employeeDetails.hire_date,
        status: employeeAttendance ? employeeAttendance.status : "To Define",
        hoursWorked: employeeAttendance ? employeeAttendance.hours_worked : 0,
        reason: employeeAttendance ? employeeAttendance.reason : "",
        productionSite: employeeDetails.production_site
      });

      setSelectedEmployee(employee);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleHoursChange = (event) => {
    setEmployeeDetails({
      ...employeeDetails,
      hoursWorked: Number(event.target.value),
    });
  };

  const handleReasonChange = (event) => {
    setEmployeeDetails({
      ...employeeDetails,
      reason: event.target.value,
    });
  };

  const handleSave = async () => {
    if (selectedEmployee) {
      await handleStatusUpdate(
        selectedEmployee,
        employeeDetails.status,
        employeeDetails.hoursWorked,
        employeeDetails.reason // Include reason here
      );
      handleClose();
    }
  };

  const filterAttendancesByDate = (status) => {
    const filteredEmployees = employees
      .map((employee) => {
        const employeeAttendance = attendances.find(
          (att) =>
            att.employee_id &&
            att.employee_id._id === employee._id &&
            dayjs(att.date).isSame(selectedDate, "day")
        );

        const cardStatus = employeeAttendance
          ? employeeAttendance.status
          : "To Define";

        if (status === "To Define" && !employeeAttendance) {
          return renderEmployeeCard(employee);
        }

        if (status === cardStatus) {
          return renderEmployeeCard(employee);
        }

        return null;
      })
      .filter((card) => card !== null);

    return filteredEmployees;
  };

  const renderEmployeeCard = (employee) => {
    return (
      <Card
        key={employee._id}
        variant="outlined"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          wordWrap: "break-word",
          backgroundColor: "#fff",
          backgroundClip: "border-box",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          borderRadius: "0.375rem",
          marginBottom: "0.25rem", // Reduced margin
          boxShadow: 1,
          height: "50px", // Set a fixed height
          width: "100%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 3,
          },
        }}
      >
        <CardContent sx={{ padding: "1px 2px" }}>
          {" "}
          {/* Smaller padding */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={0} // Reduced margin-bottom
          >
            <Box
              sx={{
                maxWidth: "70%",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                {employee.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {dayjs(selectedDate).format("YYYY-MM-DD")}
              </Typography>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => handleStatusUpdate(employee, "Present", 8)}
              >
                <CheckCircleIcon color="primary" fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleStatusUpdate(employee, "Absent", 0)}
              >
                <CancelIcon color="error" fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => handleOpen(employee)}>
                <AddCircleIcon color="action" fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, height: "100%" }}>
        <Box
          display="flex"
          justifyContent="center"
          sx={{ marginBottom: 4 }}
        ></Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => (
              <TextField {...params} sx={{ width: "250px" }} />
            )}
          />
        </LocalizationProvider>

        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ marginBottom: 4 }}
        ></Typography>

        <Grid container spacing={2} sx={{ height: "calc(100% - 160px)" }}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderRight: { xs: "none", md: "1px solid #ddd" },
              height: "100%",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                backgroundColor: "#fff",
                padding: 2,
                borderRadius: 2,
                height: "100%",
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                align="center"
                sx={{ marginBottom: 2 }}
              >
                To Define
              </Typography>
              {filterAttendancesByDate("To Define")}
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ height: "100%" }}
          >
            <Paper
              elevation={3}
              sx={{
                backgroundColor: "#e8f5e9",
                padding: 2,
                borderRadius: 2,
                height: "100%",
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                align="center"
                sx={{ marginBottom: 2 }}
              >
                Present
              </Typography>
              {filterAttendancesByDate("Present")}
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ height: "100%" }}
          >
            <Paper
              elevation={3}
              sx={{
                backgroundColor: "#ffcdd2",
                padding: 2,
                borderRadius: 2,
                height: "100%",
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                align="center"
                sx={{ marginBottom: 2 }}
              >
                Absent
              </Typography>
              {filterAttendancesByDate("Absent")}
            </Paper>
          </Grid>
        </Grid>

        {/* Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={open}>
            <Paper
              elevation={5}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: "600px",
                padding: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Employee Details
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ marginBottom: 2 }}>
                Name: {employeeDetails.name}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Email: {employeeDetails.email}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Position: {employeeDetails.position}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Hire Date: {dayjs(employeeDetails.hireDate).format("YYYY-MM-DD")}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Production Site: {employeeDetails.productionSite}
              </Typography>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={employeeDetails.status}
                  onChange={(e) =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      status: e.target.value,
                    })
                  }
                  label="Status"
                >
                  <MenuItem value="To Define">To Define</MenuItem>
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Hours Worked"
                type="number"
                value={employeeDetails.hoursWorked}
                onChange={handleHoursChange}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="reason-label">Reason</InputLabel>
                <Select
                  labelId="reason-label"
                  value={employeeDetails.reason}
                  onChange={handleReasonChange}
                  label="Reason"
                >
                  <MenuItem value="Congé">Congé</MenuItem>
                  <MenuItem value="Imprévu">Imprévu</MenuItem>
                  <MenuItem value="Retard">Retard</MenuItem>
                  <MenuItem value="Autorisation">Autorisation</MenuItem>
                </Select>
              </FormControl>
              <Box
                display="flex"
                justifyContent="flex-end"
                sx={{ marginTop: 2 }}
              >
                <Box>
                  <IconButton onClick={handleSave}>
                    <CheckCircleIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={handleClose}>
                    <CancelIcon color="error" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Modal>
      </Paper>
    </Box>
  );
};

export default AttendanceList;
