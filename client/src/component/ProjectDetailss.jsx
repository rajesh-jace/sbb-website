import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProjectDetailss.css";

const API_BASE_URL = import.meta.env.VITE_API_URL; // ← read from .env


const ProjectDetailss = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        if (response.data.success) {
          setProject(response.data.data);
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        setError("Error fetching project details.");
        console.error(err);
      }
    };

    fetchProject();
  }, [id]);

  if (error) {
    return (
      <div className="project-detail-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  if (!project) {
    return <p>Loading project details...</p>;
  }

  return (
    <div className="project-detail-container container my-4">
      <h1 className="text-center">{project.title}</h1>
      <div className="project-images">
        {project.image_urls.map((url, index) => (
          <img
            key={index}
            src={`${API_BASE_URL}${url}`}
            alt={`Project ${project.title}`}
            className="project-image"
          />
        ))}
      </div>
      <p className="project-description">{project.description}</p>
      <p>
        <strong>Type:</strong> {project.type}
      </p>
      <button className="btn btn-primary back-button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default ProjectDetailss;
