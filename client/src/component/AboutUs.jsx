import React from "react";
import image2 from "../assets/image 2.jpg";
import image3 from "../assets/image 3.jpg";
import image4 from "../assets/image 4.jpg";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <header className="about-hero">
        <h1>About Sree Balaji Builders</h1>
        <p>Building Dreams, Crafting Futures</p>
      </header>
      
        <button
          className="contact-button"
          onClick={() => (window.location.href = "/contact")}
        >
          Contact Us Today
        </button>

      {/* Mission Section */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          At Sree Balaji Builders, we aim to deliver world-class spaces that
          inspire. We bring together innovative architecture and functional
          designs to craft homes, offices, and communities of the future.
        </p>
      </section>

      {/* Vision Section */}
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          To set benchmarks in quality, sustainability, and customer
          satisfaction, becoming a trusted name for excellence in real estate.
        </p>
      </section>

      {/* Core Values Section */}
      <section className="about-section about-values">
        <h2>Our Core Values</h2>
        <ul>
          <li>
            <strong>Integrity:</strong> Transparency in every decision.
          </li>
          <li>
            <strong>Excellence:</strong> Commitment to quality.
          </li>
          <li>
            <strong>Sustainability:</strong> Building for a greener tomorrow.
          </li>
          <li>
            <strong>Customer-Centricity:</strong> Prioritizing client needs.
          </li>
        </ul>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <h2>Our Achievements</h2>
        <div className="stats-grid">
          <div className="stats-card">
            <h3>35+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="stats-card">
            <h3>15+</h3>
            <p>Years in Business</p>
          </div>
          <div className="stats-card">
            <h3>65+</h3>
            <p>Happy Clients</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img
              src={image2}
              alt="Jayabal"
              className="team-photo"
            />
            <h3>Jayabal </h3>
            <p>Founder & CEO</p>
            <p>Jayabal has over two decades of experience in real estate, leading with a vision for sustainable and innovative construction.</p>
          </div>
          <div className="team-member">
            <img
              src={image3}
              alt="Rajesh"
              className="team-photo"
            />
            <h3>Rajesh</h3>
            <p>Chief Architect</p>
            <p>Rajesh is the creative force behind our architectural designs, blending aesthetics with functionality.</p>
          </div>
          <div className="team-member">
            <img
              src={image4}
              alt="Dhanasekar"
              className="team-photo"
            />
            <h3>Dhanasekar</h3>
            <p>Project Manager</p>
            <p>Dhanasekar ensures every project runs smoothly, meeting deadlines and exceeding client expectations.</p>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="about-footer">
        <h3>Contact Us</h3>
        <p>Phone: +91-9789055341, 8667453001</p>
        <p>Email: contact@sreebalajibuilders.com</p>
        <p>Address: 123 Main Street, City, India</p>
      </footer>
    </div>
  );
};

export default AboutUs;
