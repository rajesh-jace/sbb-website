import React, { useState } from "react";
import axios from "axios";
import "./BuildYourProject.css";

const BuildYourProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "House", // Default value
    location: "",
    measurements: "",
    additionalDetails: "",
  });
  const [landPhotos, setLandPhotos] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    setLandPhotos(e.target.files);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.location) {
      setResponseMessage("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("projectType", formData.projectType);
    data.append("location", formData.location);
    data.append("measurements", formData.measurements);
    data.append("additionalDetails", formData.additionalDetails);

    for (let i = 0; i < landPhotos.length; i++) {
      data.append("landPhotos", landPhotos[i]);
    }

    try {
      const response = await axios.post("http://localhost:4500/build-project", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setResponseMessage("Your request has been submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectType: "House",
          location: "",
          measurements: "",
          additionalDetails: "",
        });
        setLandPhotos([]);
      } else {
        setResponseMessage("Failed to submit your request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setResponseMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="build-project-container">
      <h1>Build Your Dream Project</h1>
      <p>Please provide the details of your requirements. Our team will get back to you soon.</p>
      <form className="build-project-form" onSubmit={handleSubmit}>
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
          <select name="projectType" value={formData.projectType} onChange={handleChange}>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Commercial">Commercial</option>
            <option value="Jv">Joint Venture</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Project Location"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="measurements"
            value={formData.measurements}
            onChange={handleChange}
            placeholder="Measurements (e.g., sq. ft.)"
          />
        </div>
        <div className="form-group">
          <textarea
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleChange}
            placeholder="Additional Details"
            rows="4"
          ></textarea>
        </div>
        <div className="form-group">
          <input type="file" name="landPhotos" multiple onChange={handleFileChange} required />
        </div>
        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default BuildYourProject;
