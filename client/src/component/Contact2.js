import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [files, setFiles] = useState([]); // To store uploaded files

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Logging file details
    selectedFiles.forEach((file) => {
      console.log("File Name:", file.name);
      console.log("File Type:", file.type);
      console.log("File Size (bytes):", file.size);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData(); // FormData to handle files
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("message", formData.message);

      // Append each file to FormData
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      const response = await axios.post(
        "http://localhost:4500/contact",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setResponseMessage(
          "Thanks for contacting us! We will connect with you soon."
        );
        setFormData({ name: "", email: "", phone: "", message: "" });
        setFiles([]); // Clear files
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
        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
          />
        </div>
        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email Address"
            required
          />
        </div>
        {/* Phone */}
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Contact Number"
            required
          />
        </div>
        {/* Message */}
        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            required
          ></textarea>
        </div>
        {/* File Input */}
        <div className="form-group">
          <label>Upload File(s)</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
          />
          <div className="file-preview">
            {files.map((file, index) => (
              <div key={index}>
                <p>
                  <strong>Name:</strong> {file.name} <br />
                  <strong>Type:</strong> {file.type} <br />
                  <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                </p>
                {/* Show previews */}
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                {file.type.startsWith("video/") && (
                  <video
                    controls
                    style={{ width: "200px", height: "150px" }}
                  >
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </video>
                )}
                {file.type.startsWith("audio/") && (
                  <audio controls>
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Submit */}
        <button type="submit" className="submit-btn">
          Send Message
        </button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default Contact;
