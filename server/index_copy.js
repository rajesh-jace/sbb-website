const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const { log } = require("console");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');


// Default to local if not specified
const env = process.env.NODE_ENV || 'local';

// const twilio=require("twilio")

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors()); // Enable CORS
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from 'uploads' directory

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sreebalajiconstruction01@gmail.com", // Replace with the owner's email
    pass: "qxpo wprs jyyp ijcv", // Replace with the app password
  },
});

// Twilio configuration
// const twilioClient = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");

app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Send email to the owner
    await transporter.sendMail({
      from: email,
      to: "owner-email@gmail.com", // Replace with the owner's email
      subject: "New Inquiry from Contact Form",
      html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone}</p>
               <p><strong>Message:</strong> ${message}</p>`,
    });

    // Send confirmation email to the client
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Thank You for Contacting Us",
      html: `<p>Hi ${name},</p>
               <p>Thank you for reaching out. We will get back to you soon!</p>
               <p>Best regards,<br>Sree Balaji Builders</p>`,
    });

    // // Send WhatsApp message to the client
    // await twilioClient.messages.create({
    //   body: `Hi ${name}, thank you for contacting us! We'll get back to you shortly.`,
    //   from: "whatsapp:+14155238886", // Replace with your Twilio WhatsApp number
    //   to: `whatsapp:+91${phone}`, // Replace "+91" with the appropriate country code
    // });

    res
      .status(200)
      .send({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ success: false, error: "Failed to send message." });
  }
});

// Database connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rajesh@123",
  database: "sbb",
});

// Add a project with image upload
app.post("/projects", upload.array("images", 5), async (req, res) => {
  console.log("request from frontend", req.body);
  const { title, description, type, status } = req.body;
  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
  try {
    await db.query(
      "INSERT INTO projects (title, description, type, status, image_urls) VALUES (?, ?, ?, ?, ?)",
      [title, description, type, status, JSON.stringify(imageUrls)]
    );
    res
      .status(201)
      .send({ success: true, message: "Project added successfully!" });
  } catch (error) {
    console.error("Error adding project:", error.message);
    res.status(500).send({ success: false, error: "Failed to add project." });
  }
});

// Get all projects
app.get("/projects", async (req, res) => {
  try {
    // Fetch projects from the database
    const [projects] = await db.query("SELECT * FROM projects");

    // Parse and validate `image_urls`
    const processedProjects = projects.map((project) => {
      try {
        if (typeof project.image_urls === "string") {
          project.image_urls = JSON.parse(project.image_urls); // Parse if string
        }
      } catch (err) {
        console.error(
          `Error parsing image_urls for project ID ${project.id}:`,
          err.message
        );
        project.image_urls = []; // Fallback to empty array
      }
      return project; // Return processed project
    });

    res.status(200).json({ success: true, data: processedProjects });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res
      .status(500)
      .send({ success: false, error: "Failed to fetch projects." });
  }
});

app.get("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [projects] = await db.query("SELECT * FROM projects WHERE id = ?", [
      id,
    ]);
    if (projects.length === 0) {
      return res
        .status(404)
        .send({ success: false, error: "Project not found." });
    }
    const project = projects[0];

    // Check and parse image_urls correctly
    try {
      if (typeof project.image_urls === "string") {
        project.image_urls = JSON.parse(project.image_urls); // Parse JSON string
      } else if (!Array.isArray(project.image_urls)) {
        project.image_urls = []; // Fallback for invalid formats
      }
    } catch (err) {
      console.error("Error parsing image_urls:", err.message);
      project.image_urls = [];
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).send({ success: false, error: "Failed to fetch project." });
  }
});
// Update a project (with optional image upload)

app.put("/projects/:id", upload.array("images", 5), async (req, res) => {
  const { id } = req.params;
  const { title, description, type, status } = req.body;
  const newImageUrls = req.files.map((file) => `/uploads/${file.filename}`);

  try {
    const [existingProject] = await db.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
    if (existingProject.length === 0) {
      return res
        .status(404)
        .send({ success: false, error: "Project not found." });
    }

    let imageUrls = [];
    try {
      imageUrls = JSON.parse(existingProject[0].image_urls || "[]");
    } catch (error) {
      console.error("Error parsing existing image_urls:", error.message);
      imageUrls = [];
    }

    if (newImageUrls.length > 0) {
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    // Prepare fields for dynamic update
    const updates = [];
    const values = [];

    if (title) {
      updates.push("title = ?");
      values.push(title);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (type) {
      updates.push("type = ?");
      values.push(type);
    }
    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (newImageUrls.length > 0) {
      updates.push("image_urls = ?");
      values.push(JSON.stringify(imageUrls));
    }

    values.push(id);

    if (updates.length === 0) {
      return res
        .status(400)
        .send({ success: false, error: "No fields to update." });
    }

    const query = `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`;

    await db.query(query, values);

    res
      .status(200)
      .send({ success: true, message: "Project updated successfully!" });
  } catch (error) {
    console.error("Error updating project:", error.message);
    res
      .status(500)
      .send({ success: false, error: "Failed to update project." });
  }
});

// Delete a project
app.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM projects WHERE id = ?", [id]);
    res
      .status(200)
      .send({ success: true, message: "Project deleted successfully!" });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res
      .status(500)
      .send({ success: false, error: "Failed to delete project." });
  }
});

app.post("/build-project", upload.array("landPhotos", 10), async (req, res) => {
  const {
    name,
    email,
    phone,
    projectType,
    location,
    measurements,
    additionalDetails,
  } = req.body;
  const photos = req.files;
  console.log("Uploaded files:", photos);

  try {
    // Prepare file paths for database
    const photoPaths = req.files.map((file) => file.path.replace(/\\/g, "/"));

    // Save all build project info to your database
    await db.query(
      "INSERT INTO build_requests (name, email, phone, projectType, location, measurements, additionalDetails, photos, submittedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [
        name,
        email,
        phone,
        projectType,
        location,
        measurements,
        additionalDetails,
        JSON.stringify(photoPaths),
      ]
    );

    // Prepare email content
    const emailContent = `
      <h3>You have a new project request from a client:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Project Type:</strong> ${projectType}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Measurements:</strong> ${measurements}</p>
      <p><strong>Additional Details:</strong> ${additionalDetails}</p>
    `;
    const attachments = photos.map((file) => ({
      filename: file.originalname,
      path: file.path,
    }));

    // 1. Email to owner/admin
    await transporter.sendMail({
      from: "sreebalajiconstruction01@gmail.com", // your company/owner email
      to: "sreebalajiconstruction01@gmail.com", // owner's email address
      subject: "New Build Project Request",
      html: emailContent,
      attachments,
    });

    // 2. Email to customer
    await transporter.sendMail({
      from: "sreebalajiconstruction01@gmail.com", // your company/owner email
      to: email, // customer's email address
      subject: "Thank You for Your Build Project Request",
      html: `
    <h3>Hi ${name},</h3>
    <p>Thank you for submitting your build project details. Our team has received your request and will contact you soon.</p>
    <p>Best regards,<br>Sree Balaji Builders</p>
  `,
      // No attachments for customer
    });

    res.status(200).json({
      success: true,
      message: "Your request has been sent successfully!",
    });
  } catch (error) {
    console.error("Error saving to DB or sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send your request. Please try again.",
    });
  }
});

// Get all build requests for owner dashboard
app.get("/build-requests", async (req, res) => {
  try {
    const [requests] = await db.query(
      "SELECT * FROM build_requests ORDER BY submittedAt DESC"
    );
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch build requests." });
  }
});

// Delete a single build request
app.delete("/build-requests/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM build_requests WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Request deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete request." });
  }
});

app.post("/enquiry", async (req, res) => {
  const { name, email, phone, projectName } = req.body;

  try {
    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sreebalajiconstruction01@gmail.com",
        pass: "qxpo wprs jyyp ijcv",
      },
    });

    // Email to you
    const emailToAdmin = {
      from: "sreebalajiconstruction01@gmail.com",
      to: "sreebalajiconstruction01@gmail.com",
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry Details:</h3>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    };

    // Email to user
    const emailToUser = {
      from: "sreebalajiconstruction01@gmail.com",
      to: email,
      subject: "Thank You for Your Enquiry",
      html: `
        <h3>Thank you for reaching out to us!</h3>
        <p>We have received your enquiry for the project: <strong>${projectName}</strong>.</p>
        <p>We will get back to you soon.</p>
      `,
    };

    // Send emails
    await transporter.sendMail(emailToAdmin);
    await transporter.sendMail(emailToUser);

    res
      .status(200)
      .json({ success: true, message: "Enquiry sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send enquiry." });
  }
});

// Start the server
const port = 4500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
