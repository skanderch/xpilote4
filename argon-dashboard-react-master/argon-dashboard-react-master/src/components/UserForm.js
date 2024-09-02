import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  Row,
  Col,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Modal,
  Spinner,
  Alert,
} from 'reactstrap'; // Import Reactstrap components

const UserForm = ({ user, onSuccess }) => {
  const [username, setUsername] = useState(user ? user.username : '');
  const [password, setPassword] = useState(user ? '' : ''); // Do not pre-fill password
  const [roleId, setRoleId] = useState(user ? user.role_id : '');
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRoleId(user.role_id);
      setPassword(''); // Reset password field
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const userData = { username, role_id: roleId };
      if (password) userData.password = password; // Add password only if provided

      if (user) {
        await axios.put(`http://localhost:5000/api/users/${user._id}`, userData);
      } else {
        await axios.post('http://localhost:5000/api/users', userData);
      }
      onSuccess(); // Trigger the onSuccess function passed from parent
    } catch (error) {
      setError('Error submitting user');
      console.error('Error submitting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <ModalHeader toggle={() => onSuccess()}>
        {user ? 'Edit User' : 'Add User'}
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="role">Role</Label>
            <Input
              type="select"
              id="role"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            >
              {roles.map(role => (
                <option key={role._id} value={role._id}>
                  {role.role_name}
                </option>
              ))}
            </Input>
          </FormGroup>
          <Row>
            <Col>
              <Button
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner size="sm" /> : 'Save User'}
              </Button>
            </Col>
            <Col className="text-right">
              <Button
                color="secondary"
                onClick={() => onSuccess()}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Container>
  );
};

export default UserForm;
