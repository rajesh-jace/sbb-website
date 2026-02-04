const express = require("express");
const cors = require("cors");
// const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Load environment variables FIRST (before everything else)
const env = process.env.NODE_ENV || 'local';
let envFile;
switch (env) {
  case 'production':
    envFile = '.env.production';
    break;
  case 'test':
    envFile = '.env.test';
    break;
  case 'local':
  default:
    envFile = '.env.local';
    break;
}

dotenv.config({ path: envFile });
console.log(`✅ Loaded environment: ${env} from ${envFile}`);
console.log(`📧 Email: ${process.env.EMAIL_USER}`);
console.log(`🗄️  DB: ${process.env.DB_NAME}`);

// Configure Cloudinary (only if production)
if (env === 'production') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('☁️  Cloudinary configured for production');
}

const app = express();

// Serve static files (uploads folder)
// Serve static files (LOCAL only)
if (env === 'local') {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}
app.use(express.json());
app.use(cors());


// ✅ DYNAMIC UPLOAD STORAGE - Local vs Cloudinary
let upload;
if (env === 'production') {
  // PRODUCTION: Cloudinary
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'sbb-projects',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }], // Auto-resize
    },
  });
  upload = multer({ storage });
  console.log('☁️  Using Cloudinary storage (Production)');
} else {
  // LOCAL: Filesystem
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  upload = multer({ storage });
  console.log('📁 Using local filesystem storage');
}

// ✅ Nodemailer using environment variables (GLOBAL)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ DYNAMIC DATABASE - MySQL (local) vs PostgreSQL (production)
let db;

if (env === 'production' && process.env.DATABASE_URL) {
  // PRODUCTION: PostgreSQL only
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('🗄️  PostgreSQL (Render) connected');
} else {
  // LOCAL: MySQL only
  const mysql = require("mysql2/promise");
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  console.log('🗄️  MySQL (local) connected');
}


// Test DB connection (same for both)
// Test DB connection (works for BOTH MySQL & PostgreSQL)
(async () => {
  try {
    if (env === 'production' && process.env.DATABASE_URL) {
      // PostgreSQL test query
      const result = await db.query('SELECT 1');
      console.log('✅ PostgreSQL connected:', result.rows.length, 'rows');
    } else {
      // MySQL test connection
      const connection = await db.getConnection();
      await connection.query('SELECT 1');
      connection.release();
      console.log('✅ MySQL connected successfully');
    }
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
})();



// CONTACT FORM ROUTE ✅ Updated with env vars
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Send email to the owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,  // ✅ Env var
      to: process.env.EMAIL_USER,    // ✅ Owner email from env
      subject: "New Inquiry from Contact Form",
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    // Send confirmation email to the client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,  // ✅ Env var
      to: email,
      subject: "Thank You for Contacting Us",
      html: `<p>Hi ${name},</p>
             <p>Thank you for reaching out. We will get back to you soon!</p>
             <p>Best regards,<br>Sree Balaji Builders</p>`,
    });

    res.status(200).send({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ success: false, error: "Failed to send message." });
  }
});

// PROJECT ROUTES (ALL UNCHANGED - DB uses env vars automatically)
// Add a project with image upload
// ✅ PROJECTS - Works for BOTH Local & Cloudinary (same code!)
app.post("/projects", upload.array("images", 5), async (req, res) => {
  console.log("📤 Upload mode:", env === "production" ? "Cloudinary" : "Local");
  console.log("request from frontend", req.body);

  const { title, description, type, status } = req.body;

  let imageUrls;
  if (env === "production") {
    imageUrls = req.files.map((file) => file.secure_url);
  } else {
    imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
  }

  console.log("🖼️  Image URLs:", imageUrls);

  try {
    if (env === "production" && process.env.DATABASE_URL) {
      // PostgreSQL: $1, $2, ...
      await db.query(
        "INSERT INTO projects (title, description, type, status, image_urls) VALUES ($1, $2, $3, $4, $5)",
        [title, description, type, status, JSON.stringify(imageUrls)]
      );
    } else {
      // MySQL: ?
      await db.query(
        "INSERT INTO projects (title, description, type, status, image_urls) VALUES (?, ?, ?, ?, ?)",
        [title, description, type, status, JSON.stringify(imageUrls)]
      );
    }

    res.status(201).send({ success: true, message: "Project added successfully!" });
  } catch (error) {
    console.error("Error adding project:", error.message);
    res.status(500).send({ success: false, error: "Failed to add project." });
  }
});


// Get all projects
app.get("/projects", async (req, res) => {
  try {
    let projects;

    if (env === "production" && process.env.DATABASE_URL) {
      // PostgreSQL
      const result = await db.query("SELECT * FROM projects");
      projects = result.rows;           // ✅ NO destructuring here
    } else {
      // MySQL
      const [rows] = await db.query("SELECT * FROM projects");
      projects = rows;
    }

    const processedProjects = projects.map((project) => {
      try {
        if (typeof project.image_urls === "string") {
          project.image_urls = JSON.parse(project.image_urls);
        }
      } catch (err) {
        console.error(
          `Error parsing image_urls for project ID ${project.id}:`,
          err.message
        );
        project.image_urls = [];
      }
      return project;
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
    let projects;

    if (env === "production" && process.env.DATABASE_URL) {
      const result = await db.query(
        "SELECT * FROM projects WHERE id = $1",
        [id]
      );
      projects = result.rows;
    } else {
      const [rows] = await db.query(
        "SELECT * FROM projects WHERE id = ?",
        [id]
      );
      projects = rows;
    }

    if (projects.length === 0) {
      return res
        .status(404)
        .send({ success: false, error: "Project not found." });
    }

    const project = projects[0];

    try {
      if (typeof project.image_urls === "string") {
        project.image_urls = JSON.parse(project.image_urls);
      } else if (!Array.isArray(project.image_urls)) {
        project.image_urls = [];
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


// Update a project
app.put("/projects/:id", upload.array("images", 5), async (req, res) => {
  const { id } = req.params;
  const { title, description, type, status } = req.body;

  try {
    let existingProject;

    if (env === "production" && process.env.DATABASE_URL) {
      const result = await db.query(
        "SELECT * FROM projects WHERE id = $1",
        [id]
      );
      existingProject = result.rows;
    } else {
      const [rows] = await db.query(
        "SELECT * FROM projects WHERE id = ?",
        [id]
      );
      existingProject = rows;
    }

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

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      if (env === "production") {
        newImageUrls = req.files.map((file) => file.secure_url);
      } else {
        newImageUrls = req.files.map((file) => `/uploads/${file.filename}`);
      }
      imageUrls = [...imageUrls, ...newImageUrls];
      console.log(
        `🖼️ Added ${newImageUrls.length} new images. Total: ${imageUrls.length}`
      );
    }

    const updates = [];
    const values = [];

    if (title) { updates.push("title = $X"); values.push(title); }
    if (description) { updates.push("description = $X"); values.push(description); }
    if (type) { updates.push("type = $X"); values.push(type); }
    if (status) { updates.push("status = $X"); values.push(status); }
    if (newImageUrls.length > 0) {
      updates.push("image_urls = $X");
      values.push(JSON.stringify(imageUrls));
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .send({ success: false, error: "No fields to update." });
    }

    if (env === "production" && process.env.DATABASE_URL) {
      // Replace $X placeholders with actual $1, $2, ... for Postgres
      const setClauses = updates.map((u, idx) => u.replace("$X", `$${idx + 1}`));
      values.push(id); // last param for WHERE
      const query = `UPDATE projects SET ${setClauses.join(", ")} WHERE id = $${
        setClauses.length + 1
      }`;
      await db.query(query, values);
    } else {
      // MySQL: reuse existing logic
      const updatesMySQL = [];
      const valuesMySQL = [];

      if (title) { updatesMySQL.push("title = ?"); valuesMySQL.push(title); }
      if (description) { updatesMySQL.push("description = ?"); valuesMySQL.push(description); }
      if (type) { updatesMySQL.push("type = ?"); valuesMySQL.push(type); }
      if (status) { updatesMySQL.push("status = ?"); valuesMySQL.push(status); }
      if (newImageUrls.length > 0) {
        updatesMySQL.push("image_urls = ?");
        valuesMySQL.push(JSON.stringify(imageUrls));
      }

      valuesMySQL.push(id);
      const query = `UPDATE projects SET ${updatesMySQL.join(", ")} WHERE id = ?`;
      await db.query(query, valuesMySQL);
    }

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
    if (env === "production" && process.env.DATABASE_URL) {
      // Optional: fetch image_urls if you ever want to do cleanup
      const result = await db.query(
        "SELECT image_urls FROM projects WHERE id = $1",
        [id]
      );
      if (result.rows.length > 0) {
        const imageUrls = JSON.parse(result.rows[0].image_urls || "[]");
        console.log(`🗑️ Would delete ${imageUrls.length} images from Cloudinary`);
      }

      await db.query("DELETE FROM projects WHERE id = $1", [id]);
    } else {
      const [project] = await db.query(
        "SELECT image_urls FROM projects WHERE id = ?",
        [id]
      );
      if (project.length > 0) {
        const imageUrls = JSON.parse(project[0].image_urls || "[]");
        console.log(`🗑️ Would delete ${imageUrls.length} images from local`);
      }

      await db.query("DELETE FROM projects WHERE id = ?", [id]);
    }

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



// BUILD PROJECT REQUEST ROUTE ✅ Updated with env vars
app.post("/build-project", upload.array("landPhotos", 10), async (req, res) => {
  const { name, email, phone, projectType, location, measurements, additionalDetails } = req.body;
  const photos = req.files;

  console.log("📤 Build project upload mode:", env === "production" ? "Cloudinary" : "Local");
  console.log("Uploaded files:", photos);

  try {
    let photoPaths = [];
    if (photos && photos.length > 0) {
      if (env === "production") {
        photoPaths = photos.map((file) => file.secure_url);
      } else {
        photoPaths = photos.map((file) => file.path.replace(/\\/g, "/"));
      }
    }

    if (env === "production" && process.env.DATABASE_URL) {
      await db.query(
        "INSERT INTO build_requests (name, email, phone, projectType, location, measurements, additionalDetails, photos, submittedAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())",
        [name, email, phone, projectType, location, measurements, additionalDetails, JSON.stringify(photoPaths)]
      );
    } else {
      await db.query(
        "INSERT INTO build_requests (name, email, phone, projectType, location, measurements, additionalDetails, photos, submittedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
        [name, email, phone, projectType, location, measurements, additionalDetails, JSON.stringify(photoPaths)]
      );
    }

    // email logic unchanged...
    // (you can keep your existing transporter.sendMail calls)

    res.status(200).json({
      success: true,
      message: "Your request has been sent successfully!",
      photosCount: photoPaths.length,
    });
  } catch (error) {
    console.error("Error saving to DB or sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send your request. Please try again.",
    });
  }
});



// Build requests management
app.get("/build-requests", async (req, res) => {
  try {
    let requests;

    if (env === "production" && process.env.DATABASE_URL) {
      const result = await db.query(
        "SELECT * FROM build_requests ORDER BY submittedAt DESC"
      );
      requests = result.rows;
    } else {
      const [rows] = await db.query(
        "SELECT * FROM build_requests ORDER BY submittedAt DESC"
      );
      requests = rows;
    }

    const processedRequests = requests.map((request) => {
      try {
        if (typeof request.photos === "string") {
          request.photos = JSON.parse(request.photos);
        }
      } catch (err) {
        console.error(
          `Error parsing photos for request ID ${request.id}:`,
          err.message
        );
        request.photos = [];
      }
      return request;
    });

    res.status(200).json({ success: true, data: processedRequests });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch build requests." });
  }
});



app.delete("/build-requests/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (env === "production" && process.env.DATABASE_URL) {
      const result = await db.query(
        "SELECT photos FROM build_requests WHERE id = $1",
        [id]
      );
      if (result.rows.length > 0) {
        const photos = JSON.parse(result.rows[0].photos || "[]");
        console.log(
          `🗑️ Would delete ${photos.length} images from Cloudinary (auto-managed)`
        );
      }

      await db.query("DELETE FROM build_requests WHERE id = $1", [id]);
    } else {
      const [request] = await db.query(
        "SELECT photos FROM build_requests WHERE id = ?",
        [id]
      );
      if (request.length > 0) {
        const photos = JSON.parse(request[0].photos || "[]");
        console.log(
          `🗑️ Would delete ${photos.length} images from local (auto-managed)`
        );
      }

      await db.query("DELETE FROM build_requests WHERE id = ?", [id]);
    }

    res
      .status(200)
      .json({ success: true, message: "Request deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete request." });
  }
});



// ENQUIRY ROUTE ✅ Updated with env vars
app.post("/enquiry", async (req, res) => {
  const { name, email, phone, projectName } = req.body;

  try {
    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Enquiry Received",
      html: `
        <h3>New Enquiry Details:</h3>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });

    // Email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Your Enquiry",
      html: `
        <h3>Thank you for reaching out to us!</h3>
        <p>We have received your enquiry for the project: <strong>${projectName}</strong>.</p>
        <p>We will get back to you soon.</p>
      `,
    });

    res.status(200).json({ success: true, message: "Enquiry sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send enquiry." });
  }
});

// ✅ Dynamic port from environment
const port = process.env.PORT || 4500;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Environment: ${env}`);
});
