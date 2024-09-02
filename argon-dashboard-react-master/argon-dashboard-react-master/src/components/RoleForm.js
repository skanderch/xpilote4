import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  Input,
  FormGroup,
  Label,
  Form,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Modal,
  Alert,
  Spinner
} from 'reactstrap'; // Import Reactstrap components

const RoleForm = ({ role, onSuccess, onClose }) => {
  const [roleName, setRoleName] = useState(role ? role.role_name : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (role) {
        // Update existing role
        await axios.put(`http://localhost:5000/api/roles/${role._id}`, { role_name: roleName });
      } else {
        // Create new role
        await axios.post('http://localhost:5000/api/roles', { role_name: roleName });
      }
      onSuccess(); // Notify parent component of success
    } catch (error) {
      setError('Error submitting role');
      console.error('Error submitting role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen toggle={onClose}>
      <ModalHeader toggle={onClose}>
        {role ? 'Edit Role' : 'Create Role'}
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="roleName">Role Name</Label>
            <Input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : (role ? 'Update Role' : 'Create Role')}
        </Button>
        <Button color="secondary" onClick={onClose} style={{ marginLeft: '8px' }}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RoleForm;
