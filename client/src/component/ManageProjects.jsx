import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
} from "react-bootstrap";
import ProjectDetails from "./ProjectDetails";
// import "./ManageProjects.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Apartment",
    status: "Ongoing",
    images: null,
    image_urls: [],
  });
  const [editId, setEditId] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [loading, setLoading] = useState(false); // global loading for API actions

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/projects`);
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "Apartment",
      status: "Ongoing",
      images: null,
      image_urls: [],
    });
    setEditId(null);
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("status", formData.status);

    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append("images", formData.images[i]);
      }
    }

    try {
      setLoading(true);
      const apiCall = editId
        ? axios.put(`${API_BASE_URL}/projects/${editId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : axios.post(`${API_BASE_URL}/projects`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      await apiCall;

      // instead of full page reload, update list from API
      const refreshed = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(refreshed.data.data);

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      type: project.type,
      status: project.status,
      images: null,
      image_urls: project.image_urls || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/projects/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
      setSelectedProject(response.data.data);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Global orange loader overlay */}
      {loading && (
        <div className="loader-overlay">
          <div className="orange-loader">
            <div className="loader-spinner"></div>
            <p>Processing, please wait...</p>
          </div>
        </div>
      )}

      <Row className="mb-3">
        <Col>
          <Button
            variant="primary"
            style={{ marginTop: "20px" }}
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            Add Project
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover style={{ marginBottom: "200px" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.type}</td>
              <td>{project.status}</td>
              <td>{project.description}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleView(project.id)}
                  className="me-2"
                  disabled={loading}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleEdit(project)}
                  className="me-2"
                  disabled={loading}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(project.id)}
                  className="me-2"
                  disabled={loading}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => { if (!loading) { setShowModal(false); resetForm(); } }}>
        <Modal.Header closeButton={!loading}>
          <Modal.Title>{editId ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                disabled={loading}
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Individual House">Individual House</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                disabled={loading}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.files })
                }
                disabled={loading}
              />
              {formData.image_urls && formData.image_urls.length > 0 && (
                <div className="mt-2">
                  <p>Existing Images:</p>
                  {formData.image_urls.map((url, index) => (
                    <img
                      key={index}
                      src={`${API_BASE_URL}${url}`}
                      alt="Project"
                      width="100"
                      className="me-2"
                    />
                  ))}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => { setShowModal(false); resetForm(); }}
            disabled={loading}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {editId ? (loading ? "Updating..." : "Save Changes") : (loading ? "Saving..." : "Save")}
          </Button>
        </Modal.Footer>
      </Modal>

      <ProjectDetails
        show={showDetails}
        onClose={() => setShowDetails(false)}
        project={selectedProject}
        onEdit={handleEdit}
      />
    </Container>
  );
};

export default ManageProjects;
