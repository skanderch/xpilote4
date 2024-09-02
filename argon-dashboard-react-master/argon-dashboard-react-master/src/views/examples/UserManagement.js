import React, { useState } from 'react';
import UserList from '../../components/UserList';
import UserForm from '../../components/UserForm';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col
} from 'reactstrap'; // Import Reactstrap components

const UserManagement = () => {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUserCreated = () => {
    setRefresh(!refresh); // Refresh the UserList
    handleClose(); // Close the modal after creating a user
  };

  return (
    <Container fluid style={{ paddingTop: '20px' }}>
      
      <UserList key={refresh} />
      <Modal isOpen={open} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>Add User</ModalHeader>
        <ModalBody>
          <UserForm onSuccess={handleUserCreated} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleUserCreated}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default UserManagement;
