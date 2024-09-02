import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Row,
  Col,
  Container,
} from "reactstrap";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(weekOfYear);

const AttendanceTable = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("month"));
  const [selectedFilter, setSelectedFilter] = useState("");
  const [employeeNameFilter, setEmployeeNameFilter] = useState("");
  const [productionSiteFilter, setProductionSiteFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({
    date: false,
    summary: false,
    weekly: false,
    site: false,
    position: false,
  });

  const [showSummary, setShowSummary] = useState(false);
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [showPositionSummary, setShowPositionSummary] = useState(false);
  const [showWeeklyPositionSummary, setShowWeeklyPositionSummary] =
    useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchAttendances();
  }, [selectedDate, selectedFilter, productionSiteFilter, positionFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchAttendances = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/attendances");
      setAttendances(response.data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    }
  };

  const filteredAttendances = attendances.filter((attendance) => {
    const dateMatch = dayjs(attendance.date).isSame(selectedDate, "month");
    const employee = employees.find((emp) => emp._id === attendance.employee_id._id);
    const nameMatch = employeeNameFilter
      ? employee?.name.toLowerCase().includes(employeeNameFilter.toLowerCase())
      : true;
    const productionSiteMatch = productionSiteFilter
      ? employee?.production_site === productionSiteFilter
      : true;
    const positionMatch = positionFilter
      ? employee?.position === positionFilter
      : true;
  
    return dateMatch && nameMatch && productionSiteMatch && positionMatch;
  });
  

  const employeeTotals = useMemo(
    () => calculateTotals(filteredAttendances, employees),
    [filteredAttendances, employees]
  );
  const employeeWeeklyTotals = useMemo(
    () => calculateWeeklyTotals(filteredAttendances, employees),
    [filteredAttendances, employees]
  );
  const positionTotals = useMemo(
    () => calculatePositionTotals(filteredAttendances, employees),
    [filteredAttendances, employees]
  );
  const weeklyPositionTotals = useMemo(
    () => calculateWeeklyPositionTotals(filteredAttendances, employees),
    [filteredAttendances, employees]
  );

  const toggleDropdown = (filterType) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
    setSelectedFilter(filterType);
  };

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    setShowSummary(filterType === "summary");
    setShowWeeklySummary(filterType === "weekly");
    setShowPositionSummary(filterType === "positionSummary");
    setShowWeeklyPositionSummary(filterType === "weeklyPositionSummary");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <Row className="mb-4">
          <Col md={3}>
            <Input
              placeholder="Filter by Employee Name"
              onChange={(e) => setEmployeeNameFilter(e.target.value)}
              className="mb-2"
            />
          </Col>
          <Col md={3}>
            <Dropdown
              isOpen={dropdownOpen.site}
              toggle={() => toggleDropdown("site")}
              className="mb-2"
            >
              <DropdownToggle caret>Filter by Production Site</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => setProductionSiteFilter("")}>
                  All
                </DropdownItem>
                {["Paris", "Tunis", "Beyrouth", "Madagascar"].map((site) => (
                  <DropdownItem
                    key={site}
                    onClick={() => setProductionSiteFilter(site)}
                  >
                    {site}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col md={3}>
            <Dropdown
              isOpen={dropdownOpen.position}
              toggle={() => toggleDropdown("position")}
              className="mb-2"
            >
              <DropdownToggle caret>Filter by Position</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => setPositionFilter("")}>
                  All
                </DropdownItem>
                {[...new Set(employees.map((emp) => emp.position))].map(
                  (position) => (
                    <DropdownItem
                      key={position}
                      onClick={() => setPositionFilter(position)}
                    >
                      {position}
                    </DropdownItem>
                  )
                )}
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col md={3}>
            <Dropdown
              isOpen={dropdownOpen.date}
              toggle={() => toggleDropdown("date")}
              className="mb-2"
            >
              <DropdownToggle caret>Select Filter</DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => handleFilterChange("monthlyAttendance")}
                >
                  Month's Attendance
                </DropdownItem>
                <DropdownItem onClick={() => handleFilterChange("summary")}>
                  Month's Summary per Agent
                </DropdownItem>
                <DropdownItem onClick={() => handleFilterChange("weekly")}>
                  Weekly Summary per Agent
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleFilterChange("positionSummary")}
                >
                  Monthly Summary per Position
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleFilterChange("weeklyPositionSummary")}
                >
                  Weekly Summary per Position
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Month"
                value={selectedDate}
                onChange={(newValue) =>
                  setSelectedDate(newValue.startOf("month"))
                }
                renderInput={(params) => <Input {...params} />}
                className="w-100"
              />
            </LocalizationProvider>
          </Col>
        </Row>

        <Row>
          <Col>
            {showSummary && (
              <>
                <h4> Monthly Summary per Agent</h4>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Position</th>
                        <th>Production Site</th>
                        <th>Total Hours Worked</th>
                        <th>Total Days Worked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(employeeTotals).map((empId) => {
                        const total = employeeTotals[empId];
                        return (
                          <tr key={empId}>
                            <td>{total.name}</td>
                            <td>{total.position}</td>
                            <td>{total.productionSite}</td>
                            <td>{total.totalHours}</td>
                            <td>{total.totalDays}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
            {showWeeklySummary && (
              <>
                <h4>Weekly Summary per Agent</h4>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Employee Name</th>
                        <th>Position</th>
                        <th>Production Site</th>
                        <th>Week Number</th>
                        <th>Total Hours Worked</th>
                        <th>Total Days Worked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(employeeWeeklyTotals).map((empId) => {
                        const weeks = employeeWeeklyTotals[empId].weeks;
                        return Object.keys(weeks).map((weekNumber) => {
                          const total = weeks[weekNumber];
                          return (
                            <tr key={`${empId}-${weekNumber}`}>
                              <td>{employeeWeeklyTotals[empId].name}</td>
                              <td>{employeeWeeklyTotals[empId].position}</td>
                              <td>
                                {employeeWeeklyTotals[empId].productionSite}
                              </td>
                              <td>{weekNumber}</td>
                              <td>{total.totalHours}</td>
                              <td>{total.totalDays}</td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
            {showPositionSummary && (
              <>
                <h4>Monthly Summary per Position</h4>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Total Hours Worked</th>
                        <th>Total Days Worked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(positionTotals).map((position) => {
                        const total = positionTotals[position];
                        return (
                          <tr key={position}>
                            <td>{position}</td>
                            <td>{total.totalHours}</td>
                            <td>{total.totalDays}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
            {showWeeklyPositionSummary && (
              <>
                <h4>Weekly Summary per Position</h4>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Week Number</th>
                        <th>Total Hours Worked</th>
                        <th>Total Days Worked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(weeklyPositionTotals).map((position) => {
                        const total = weeklyPositionTotals[position];
                        return (
                          <tr key={position}>
                            <td>{position}</td>
                            <td>{total.weekNumber}</td>
                            <td>{total.totalHours}</td>
                            <td>{total.totalDays}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </>
            )}

            {!showSummary &&
              !showWeeklySummary &&
              !showPositionSummary &&
              !showWeeklyPositionSummary && (
                <>
                  <h4>Filtered Attendance Data</h4>
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <Table striped>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Employee Name</th>
                          <th>Position</th>
                          <th>Production Site</th>
                          <th>Status</th>
                          <th>Hours Worked</th>
                          <th>Reason</th> {/* New column for Reason */}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttendances.map((attendance) => {
                          const employee = employees.find(
                            (emp) => emp._id === attendance.employee_id._id
                          );
                          return (
                            <tr key={attendance._id}>
                              <td>
                                {dayjs(attendance.date).format("YYYY-MM-DD")}
                              </td>
                              <td>{employee ? employee.name : "Unknown"}</td>
                              <td>
                                {employee ? employee.position : "Unknown"}
                              </td>
                              <td>
                                {employee
                                  ? employee.production_site
                                  : "Unknown"}
                              </td>
                              <td>{attendance.status}</td>
                              <td>{attendance.hours_worked}</td>
                              <td>{attendance.reason}</td>{" "}
                              {/* Display Reason */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

// Helper Functions
const calculateTotals = (attendances, employees) => {
  const employeeTotals = {};
  attendances.forEach((attendance) => {
    const employee = employees.find(
      (emp) => emp._id === attendance.employee_id._id
    );
    if (employee) {
      const empId = employee._id;
      if (!employeeTotals[empId]) {
        employeeTotals[empId] = {
          name: employee.name,
          position: employee.position,
          productionSite: employee.production_site,
          totalHours: 0,
          totalDays: 0,
        };
      }
      employeeTotals[empId].totalHours += attendance.hours_worked || 0;
      // Calculate fractional days worked
      employeeTotals[empId].totalDays += (attendance.hours_worked || 0) / 8;
    }
  });
  return employeeTotals;
};

const calculateWeeklyTotals = (attendances, employees) => {
  const weeklyTotals = {};

  attendances.forEach((attendance) => {
    const employee = employees.find(
      (emp) => emp._id === attendance.employee_id._id
    );
    if (employee) {
      const weekNumber = dayjs(attendance.date).week();
      const empId = employee._id;

      if (!weeklyTotals[empId]) {
        weeklyTotals[empId] = {
          name: employee.name,
          position: employee.position,
          productionSite: employee.production_site,
          weeks: {},
        };
      }

      if (!weeklyTotals[empId].weeks[weekNumber]) {
        weeklyTotals[empId].weeks[weekNumber] = {
          weekNumber,
          totalHours: 0,
          totalDays: 0,
        };
      }

      weeklyTotals[empId].weeks[weekNumber].totalHours +=
        attendance.hours_worked || 0;
      // Calculate fractional days worked
      weeklyTotals[empId].weeks[weekNumber].totalDays +=
        (attendance.hours_worked || 0) / 8;
    }
  });

  return weeklyTotals;
};

const calculatePositionTotals = (attendances, employees) => {
  const positionTotals = {};
  attendances.forEach((attendance) => {
    const employee = employees.find(
      (emp) => emp._id === attendance.employee_id._id
    );
    if (employee) {
      const position = employee.position;
      if (!positionTotals[position]) {
        positionTotals[position] = {
          totalHours: 0,
          totalDays: 0,
        };
      }
      positionTotals[position].totalHours += attendance.hours_worked || 0;
      // Calculate fractional days worked
      positionTotals[position].totalDays += (attendance.hours_worked || 0) / 8;
    }
  });
  return positionTotals;
};

const calculateWeeklyPositionTotals = (attendances, employees) => {
  const weeklyPositionTotals = {};

  attendances.forEach((attendance) => {
    const employee = employees.find(
      (emp) => emp._id === attendance.employee_id._id
    );
    if (employee) {
      const weekNumber = dayjs(attendance.date).week();
      const position = employee.position;

      if (!weeklyPositionTotals[position]) {
        weeklyPositionTotals[position] = {
          weekNumber,
          totalHours: 0,
          totalDays: 0,
        };
      }

      weeklyPositionTotals[position].weekNumber = weekNumber;
      weeklyPositionTotals[position].totalHours += attendance.hours_worked || 0;
      // Calculate fractional days worked
      weeklyPositionTotals[position].totalDays +=
        (attendance.hours_worked || 0) / 8;
    }
  });

  return weeklyPositionTotals;
};

export default AttendanceTable;
