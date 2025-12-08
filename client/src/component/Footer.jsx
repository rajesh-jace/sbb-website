import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";
import logo from "../assets/logo.jpeg";

const Footer = () => {
  return (
    <div className="footer-container">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-wrapper">
          <img src={logo} alt="Company Logo" className="footer-logo" />
        </div>
      </div>

      {/* Footer Content Section */}
      <div className="footer-content py-4">
        <Container>
          <Row className="footer-row">
            <Col className="footer-column" md={3} sm={6} xs={12}>
              <Button className="contact-button small-button" href="/contact">
                Contact Us
              </Button>
            </Col>
            <Col className="footer-column" md={3} sm={6} xs={12}>
              <h5>Our Works</h5>
              <p>What we do</p>
            </Col>
            <Col className="footer-column" md={3} sm={6} xs={12}>
              <h5>Company</h5>
              <p>About</p>
              <p>Careers</p>
              <p>Our Process</p>
            </Col>
            <Col className="footer-column" md={3} sm={6} xs={12}>
              <h5>Follow Us</h5>
              <div className="social-icons left-align">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="social-icon" /> Twitter
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="social-icon" /> Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="social-icon" /> Instagram
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="social-icon" /> LinkedIn
                </a>
              </div>
            </Col>
          </Row>
          <hr className="divider" />
          <p className="text-center copyright">&copy; 2024 Real Estate Hub. All Rights Reserved.</p>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
