import { useState, useEffect } from "react";
import axios from "axios";
import "./Projects.css";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import EnquiryForm from "./EnquiryForm";
import image1 from "../assets/generated-image.png";
import image2 from "../assets/generated-image_1.png";

const API_BASE_URL = import.meta.env.VITE_API_URL; // ← read from .env


const SectionHeading = ({ iconSrc, title }) => {
  return (
    <div className="section-heading-card">
      <img src={iconSrc} alt="icon" className="heading-icon" />
      <h2 className="heading-text">{title}</h2>
    </div>
  );
};


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects`);
        console.log(response);

        if (response.data.success) {
          const allProjects = response.data.data;
          setProjects(allProjects);
          // Filter ongoing projects based on the `status` field
          setOngoingProjects(
            allProjects.filter((project) => project.status === "Ongoing")
          );
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleEnquiryClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="projects-container container my-4">
      <h1 className="text-center mb-4">Real Estate Projects</h1>

      {/* Ongoing Projects Section */}
      <section className="ongoing-projects mb-5">
          <SectionHeading 
    iconSrc={image1} 
    title="ONGOING PROJECTS" 
  />
        
        <div className="row">
          {ongoingProjects.map((project) => (
            <div className="col-md-4 mb-4" key={project.id}>
              <div className="card project-card">
                <Carousel interval={null} className="project-carousel">
                  {project.image_urls?.length > 0 ? (
                    project.image_urls.map((url, index) => (
                      <Carousel.Item key={index}>
                        <img
                          src={`${API_BASE_URL}${url}`}
                          className="card-img-top project-image"
                          alt={project.title}
                        />
                      </Carousel.Item>
                    ))
                  ) : (
                    <Carousel.Item>
                      <img
                        src={`${API_BASE_URL}/default.jpg`}
                        className="card-img-top project-image"
                        alt="Default"
                      />
                    </Carousel.Item>
                  )}
                </Carousel>
                <div className="card-body">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text">{project.description.length > 100
                    ? `${project.description.slice(0, 100)}...`
                    : project.description}</p>
                  <p>
                    <strong>Type:</strong> {project.type}
                  </p>
                  {/* View and Enquiry Buttons */}
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleEnquiryClick(project)}
                    >
                      Enquiry
                    </button>

                    {/* Enquiry Form Modal */}
                    {selectedProject && (
                      <EnquiryForm
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        project={selectedProject}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Projects Section */}
      <section className="all-projects">
          <SectionHeading 
    iconSrc={image2} 
    title="ALL PROJECTS" 
  />
        
        <div className="row">
          {projects.map((project) => (
            <div className="col-md-4 mb-4" key={project.id}>
              <div className="card project-card">
                <Carousel interval={null} className="project-carousel">
                  {project.image_urls?.length > 0 ? (
                    project.image_urls.map((url, index) => (
                      <Carousel.Item key={index}>
                        <img
                          src={`${API_BASE_URL}${url}`}
                          className="card-img-top project-image"
                          alt={project.title}
                        />
                      </Carousel.Item>
                    ))
                  ) : (
                    <Carousel.Item>
                      <img
                        src={`${API_BASE_URL}/default.jpg`}
                        className="card-img-top project-image"
                        alt="Default"
                      />
                    </Carousel.Item>
                  )}
                </Carousel>
                <div className="card-body">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text">{project.description.length > 100
                    ? `${project.description.slice(0, 100)}...`
                    : project.description}</p>
                  <p>
                    <strong>Type:</strong> {project.type}
                  </p>
                  {/* View Button */}
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
