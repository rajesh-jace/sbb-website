import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Slider from "react-slick";
import "./ManageRequests.css";

const API_BASE_URL = import.meta.env.VITE_API_URL; // ← read from .env


const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  // Fetch requests
  useEffect(() => {
    axios.get(`${API_BASE_URL}/build-requests`)
      .then(res => { setRequests(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Delete request
  const handleDelete = async (id) => {
    if(window.confirm("Delete this request permanently?")) {
      await axios.delete(`${API_BASE_URL}/build-requests/${id}`);
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  // Helper to parse photos
 const parsePhotos = (photoField) => {
  if (!photoField) return [];
  if (Array.isArray(photoField)) return photoField;
  try {
    const arr = JSON.parse(photoField);
    if (Array.isArray(arr)) return arr;
  } catch (e) {
    if (typeof photoField === "string" && photoField.includes(",")) {
      return photoField.split(",").map(p => p.trim().replace(/\\/g, "/")).filter(Boolean);
    }
  }
  return [];
};


  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="manage-requests-container">
      <h2>All Build Project Requests</h2>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th>
            <th>Project Type</th><th>Location</th>
            <th>Date</th><th>Photos</th>
            <th>View</th><th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.phone}</td>
              <td>{req.projectType}</td>
              <td>{req.location}</td>
              <td>{new Date(req.submittedAt).toLocaleString()}</td>
              <td>
  {parsePhotos(req.photos).length > 0
    ? <div className="photos-thumbs">
        {parsePhotos(req.photos).slice(0,2).map((photo, idx) =>
  <img key={idx} src={`${API_BASE_URL}/${photo.replace(/\\/g, "/")}`} className="thumb" alt={`land-${idx}`}/>
    )
    }
      </div>
    : <span style={{color:'#666'}}>No photos (or upload failed)</span>}
</td>

              <td>
                <button className="view-btn" onClick={() => { setActiveRequest(req); setShowModal(true); }}>
                  View
                </button>
              </td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(req.id)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Build Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeRequest && (
            <div>
              {/* Photo slider */}
            <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
            {parsePhotos(activeRequest.photos).map((photo, idx) => (
                <img
                key={idx}
                src={`${API_BASE_URL}/${photo.replace(/\\/g, "/")}`}
                alt={`land-${idx}`}
                style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
                />
            ))}
            </Slider>

              {/* Data section */}
              <div className="details-section">
                <strong>Name:</strong> {activeRequest.name}<br />
                <strong>Email:</strong> {activeRequest.email}<br />
                <strong>Phone:</strong> {activeRequest.phone}<br />
                <strong>Type:</strong> {activeRequest.projectType}<br />
                <strong>Location:</strong> {activeRequest.location}<br />
                <strong>Measurements:</strong> {activeRequest.measurements}<br />
                <strong>Additional:</strong> {activeRequest.additionalDetails}<br />
                <strong>Date:</strong> {new Date(activeRequest.submittedAt).toLocaleString()}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageRequests;
