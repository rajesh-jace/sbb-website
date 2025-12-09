import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

const API_BASE_URL = import.meta.env.VITE_API_URL; // ← read from .env


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contact`,
        formData
      );
      if (response.data.success) {
        setResponseMessage(
          "Thanks for contacting us! We will connect with you soon."
        );
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setResponseMessage("Failed to send your message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setResponseMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Please fill out the form below.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
  <div className="form-row">
    <div className="form-group">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Full Name"
        required
      />
    </div>
    <div className="form-group">
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email Address"
        required
      />
    </div>
    <div className="form-group">
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Your Contact Number"
        required
      />
    </div>
  </div>
  <div className="form-group">
    <textarea
      name="message"
      value={formData.message}
      onChange={handleChange}
      placeholder="Your Message"
      rows="4"
      required
    ></textarea>
  </div>
  <button type="submit" className="submit-btn">
    Send Message
  </button>
</form>

      {responseMessage && <p className="response-message">{responseMessage}</p>}

      {/* Company Contact Info */}
      <div className="company-info">
        <div className="info-container">
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <span>+91-8667453001</span>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <span>contact@company.com</span>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>123, Main Street, City, India</span>
          </div>
        </div>
        <iframe
          title="location-map"
          src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d242.93200656478973!2d80.22935174914547!3d13.041266495829808!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1732731175315!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "8px" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
