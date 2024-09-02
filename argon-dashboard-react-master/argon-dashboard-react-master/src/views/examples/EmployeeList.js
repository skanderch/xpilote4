import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Input,
  Row,
  Col,
  FormGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'; // Import Reactstrap components

import EmployeeForm from '../../components/EmployeeForm'; // Ensure the path is correct

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter(employee => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setOpenModal(false);
    fetchEmployees(); // Refresh employee list after editing
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filterEmployees = useCallback(() => {
    setFilteredEmployees(
      employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.production_site || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, employees]);

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  return (
    <Container fluid style={{ paddingTop: '20px' }}>
      <Row className="mb-4">
        <Col>
          <h4>Agent List</h4>
          <FormGroup>
            <Label for="searchTerm">Search Agent</Label>
            <Input
              type="text"
              id="searchTerm"
              placeholder="Search Employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormGroup>
          <Button
            color="primary"
            onClick={() => {
              setSelectedEmployee(null);
              setOpenModal(true);
            }}
          >
            Add Agent
          </Button>
        </Col>
      </Row>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Hire Date</th>
            <th>Status</th>
            <th>Production Site</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{new Date(employee.hire_date).toLocaleDateString()}</td>
              <td>{employee.status}</td>
              <td>{employee.production_site || 'N/A'}</td>
              <td>
                <Button color="primary" onClick={() => handleEdit(employee)}>
                  Edit
                </Button>
                <Button color="danger" onClick={() => handleDelete(employee._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <PaginationItem disabled={page <= 1}>
          <PaginationLink first onClick={() => handlePageChange(1)} />
        </PaginationItem>
        <PaginationItem disabled={page <= 1}>
          <PaginationLink previous onClick={() => handlePageChange(page - 1)} />
        </PaginationItem>
        {[...Array(totalPages).keys()].map(number => (
          <PaginationItem active={number + 1 === page} key={number}>
            <PaginationLink onClick={() => handlePageChange(number + 1)}>
              {number + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={page >= totalPages}>
          <PaginationLink next onClick={() => handlePageChange(page + 1)} />
        </PaginationItem>
        <PaginationItem disabled={page >= totalPages}>
          <PaginationLink last onClick={() => handlePageChange(totalPages)} />
        </PaginationItem>
      </Pagination>
      
      <Modal isOpen={openModal} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Add/Edit Agent</ModalHeader>
        <ModalBody>
          <EmployeeForm employee={selectedEmployee} onSuccess={handleCloseModal} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default EmployeeList;
