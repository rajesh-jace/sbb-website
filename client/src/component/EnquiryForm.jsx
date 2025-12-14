import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL; // ← read from .env

const EnquiryForm = ({ show, handleClose, project }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false); // ← loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(`${API_BASE_URL}/enquiry`, {
      ...formData,
      projectName: project.title,
    });

    if (response.data.success) {
      // optional: small delay to ensure paint
      // await new Promise(res => setTimeout(res, 300));

      setLoading(false);          // stop loader first
      alert("Enquiry sent successfully! Check your email for confirmation.");
      resetForm();
      handleClose();
    } else {
      setLoading(false);
      alert("Failed to send enquiry. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    setLoading(false);
    alert("Failed to send enquiry. Please try again.");
  }
};


  return (
    <>
      {/* Local loader overlay (optional, matches your theme) */}
      {loading && (
        <div className="loader-overlay">
          <div className="orange-loader">
            <div className="loader-spinner"></div>
            <p>Submitting your enquiry...</p>
          </div>
        </div>
      )}

      <Modal show={show} onHide={loading ? undefined : handleClose}>
        <Modal.Header closeButton={!loading}>
          <Modal.Title>Enquiry for {project.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleClose} disabled={loading} className="me-2">
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EnquiryForm;
