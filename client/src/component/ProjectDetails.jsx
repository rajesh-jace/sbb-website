import React from "react";
import { Modal, Carousel, Button } from "react-bootstrap";


const API_BASE_URL = import.meta.env.VITE_API_URL; // ← read from .env


const ProjectDetails = ({ show, onClose, project, onEdit }) => {

    console.log(project);
    
  if (!project) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{project.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel>
          {project.image_urls?.map((url, index) => {
            if (!url) return null;

            const src =
              typeof url === "string" && url.startsWith("http")
                ? url                         // Cloudinary
                : `${API_BASE_URL}${url}`;    // Local /uploads

            return (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={src}
                  alt={`Slide ${index + 1}`}
                />
              </Carousel.Item>
            );
          })}
        </Carousel>


        <div className="mt-3">
          <h5>Description</h5>
          <p className="project-description">{project.description}</p>
          <h6>Type: {project.type}</h6>
          <h6>Status: {project.status}</h6>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onEdit(project)}>
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectDetails;
