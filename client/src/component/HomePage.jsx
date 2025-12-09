import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Carousel } from "react-bootstrap";
import "./HomePage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL; // ← read from .env

const HomePage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/projects`).then((response) => {
      if (response.data.success) {
        setProjects(response.data.data);
      }
    });
  }, []);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section text-white text-center py-5">
        <Container>
          <h1 className="hero-title">Welcome to Real Estate Hub</h1>
          <p className="hero-description">
            Find your dream property or build your own with ease.
          </p>
          <div>
            <Button
              variant="primary"
              href="/projects"
              className="me-2 hero-btn"
            >
              View Projects
            </Button>
            <Button
              variant="outline-light"
              href="/contact"
              className="hero-btn"
            >
              Contact Us
            </Button>
          </div>
        </Container>
      </div>

      {/* Featured Projects */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Projects</h2>
        <Row>
          {featuredProjects.map((project) => (
            <Col md={6} lg={4} key={project.id} className="mb-4">
              <Card className="project-card">
                <Card.Img
                  variant="top"
                  src={
                    project.image_urls?.[0]
                      ? `${API_BASE_URL}${project.image_urls[0]}`
                      : "/images/default.jpg"
                  }
                  alt={project.title}
                />

                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <Button variant="primary" href={`/projects/${project.id}`}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Why Choose Us */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Why Choose Us</h2>
          <Row>
            <Col md={4} className="text-center">
              <h3>Experience</h3>
              <p>
                Over 10 years in the industry with hundreds of satisfied
                customers.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <h3>Quality</h3>
              <p>
                We deliver the best-in-class properties with a focus on
                excellence.
              </p>
            </Col>
            <Col md={4} className="text-center">
              <h3>Support</h3>
              <p>Our team is here to guide you at every step of the process.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
