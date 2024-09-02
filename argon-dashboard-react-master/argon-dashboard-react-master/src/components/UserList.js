import React, { useState, useEffect } from 'react';
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
  PaginationLink,
  Spinner,
  Alert
} from 'reactstrap'; // Import Reactstrap components

import UserForm from './UserForm'; // Ensure the path is correct

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(false);
    fetchUsers();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid style={{ paddingTop: '20px' }}>
      <Row className="mb-4">
        <Col>
          <h4>User List</h4>
          <FormGroup>
            <Label for="searchTerm">Search Users</Label>
            <Input
              type="text"
              id="searchTerm"
              placeholder="Search Users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormGroup>
          <Button
            color="primary"
            onClick={() => {
              setSelectedUser(null);
              setOpenModal(true);
            }}
          >
            Add User
          </Button>
        </Col>
      </Row>
      {isLoading && <Spinner color="primary" />}
      {error && <Alert color="danger">{error}</Alert>}
      <Table striped>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role_id?.role_name || 'N/A'}</td>
              <td className="text-right">
                <Button
                  color="primary"
                  onClick={() => handleEdit(user)}
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="mt-4">
        <Col>
          <Pagination>
            <PaginationItem disabled={page === 1}>
              <PaginationLink previous onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {[...Array(Math.ceil(filteredUsers.length / rowsPerPage))].map((_, index) => (
              <PaginationItem key={index + 1} active={page === index + 1}>
                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={page === Math.ceil(filteredUsers.length / rowsPerPage)}>
              <PaginationLink next onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </Pagination>
        </Col>
        <Col>
          <FormGroup>
            <Label for="rowsPerPage">Rows per Page</Label>
            <Input
              type="select"
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
      <Modal isOpen={openModal} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Add/Edit User</ModalHeader>
        <ModalBody>
          <UserForm user={selectedUser} onSuccess={handleCloseModal} />
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

export default UserList;
