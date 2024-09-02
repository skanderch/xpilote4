import React, { useState } from "react";
import RoleForm from "../../components/RoleForm";
import RoleList from "../../components/RoleList";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

const RoleManagement = () => {
  const [open, setOpen] = useState(false); // State to control the modal
  const [refresh, setRefresh] = useState(false);

  const handleRoleCreated = () => {
    setRefresh(!refresh); // Refresh the RoleList
    handleClose(); // Close the modal after creating a role
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  return (
    <Container
      fluid
      style={{ 
        paddingTop: "20px", 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh" 
      }}
    >
   

      <Modal isOpen={open} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>Add Role</ModalHeader>
        <ModalBody>
          <RoleForm onRoleCreated={handleRoleCreated} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleRoleCreated}>
            Save
          </Button>
        </ModalFooter>
      </Modal>

      <div style={{ flex: 1, overflow: "auto" }}>
        <RoleList key={refresh} />
      </div>

      {/* Optionally, you can include a footer here if needed */}
      <footer style={{ textAlign: "center", padding: "10px" }}>
        {/* Footer content goes here */}
      </footer>
    </Container>
  );
};

export default RoleManagement;
