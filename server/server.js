const express = require("express");
const pool = require("./db");
const db = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

// ✅ Middleware Setup
app.use(bodyParser.json());
app.use(cors());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      const ext = path.split(".").pop().toLowerCase();
      const contentTypeMap = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
      };
      res.set("Content-Type", contentTypeMap[ext] || "application/octet-stream");
    },
  })
);

// ✅ Database Connection Check
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Connected to MySQL database");
  } catch (err) {
    console.error("❌ Error connecting to MySQL:", err);
  }
})();

// ✅ LOGIN ENDPOINT (Buyer/Seller)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔵 Login request received for:", email);

    let user = null;
    let role = null;

    // Check buyers table
    const [buyerRows] = await db.execute("SELECT * FROM buyers WHERE email = ?", [email]);
    if (buyerRows.length > 0) {
      user = buyerRows[0];
      role = "buyer";
    }

    // Check sellers table if not found in buyers
    if (!user) {
      const [sellerRows] = await db.execute("SELECT * FROM sellers WHERE email = ?", [email]);
      if (sellerRows.length > 0) {
        user = sellerRows[0];
        role = "seller";
      }
    }

    // If user not found
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Login success ✅
    console.log(`✅ Login successful! Role: ${role}`);
    res.status(200).json({
      message: "Login successful",
      role,
      user,
      sellerId: role === "seller" ? user.id : null,
      buyerId: role === "buyer" ? user.id : null,
    });
  } catch (error) {
    console.error("🔥 Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ MULTER SETUP (Crop Image Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ CROP UPLOAD ENDPOINT
app.post("/crops", upload.single("image"), async (req, res) => {
  try {
    const { cropName, description, quantity, price, cropType, sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "❗ Seller ID is required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
      INSERT INTO crops (seller_id, crop_name, description, quantity, price, crop_type, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [sellerId, cropName, description, quantity, price, cropType, imageUrl]);

    res.status(201).json({ message: "✅ Crop added successfully!" });
  } catch (err) {
    console.error("🔥 Error adding crop:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ GET CROPS for Seller Inventory (Filtered by sellerId)
app.get("/crops", async (req, res) => {
  const { sellerId } = req.query;

  if (!sellerId) {
    return res.status(400).json({ message: "❗ Seller ID is required" });
  }

  try {
    const query = "SELECT * FROM crops WHERE seller_id = ?";
    const [rows] = await db.execute(query, [sellerId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No crops found for this seller" });
    }

    const updatedCrops = rows.map((crop) => ({
      ...crop,
      image_url: crop.image_url
        ? `http://localhost:5000${crop.image_url}`
        : "https://via.placeholder.com/60",
    }));

    res.status(200).json({ crops: updatedCrops });
  } catch (error) {
    console.error("🔥 Error fetching seller crops:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get Crops by Category (For Buyers) — Fixed Image URL
app.get("/crops-by-category", async (req, res) => {
  const { category } = req.query;

  try {
    let query = "SELECT crop_name, description, quantity, price, crop_type, image_url FROM crops";
    let params = [];

    if (category) {
      query += " WHERE crop_type = ?";
      params.push(category);
    }

    const [rows] = await db.execute(query, params);

    const updatedCrops = rows.map((crop) => ({
      ...crop,
      image_url: crop.image_url
        ? `http://localhost:5000${crop.image_url}`
        : "https://via.placeholder.com/60",
    }));

    if (updatedCrops.length === 0) return res.status(404).json({ message: "No crops found for this category" });

    res.status(200).json({ crops: updatedCrops });
  } catch (error) {
    console.error("🔥 Error fetching crops by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update Crop
app.put('/crops/:cropId', async (req, res) => {
  const { cropId } = req.params;
  const { quantity } = req.body;

  try {
    const [updateResult] = await db.query(
      "UPDATE crops SET quantity = ? WHERE id = ?",
      [quantity, cropId]
    );

    console.log("🔍 DB Response:", updateResult);

    if (updateResult.affectedRows > 0) {
      // ✅ Fetch the updated crop after updating
      const [updatedCrop] = await db.query("SELECT * FROM crops WHERE id = ?", [cropId]);

      if (updatedCrop.length > 0) {
        console.log("✅ Updated Crop:", updatedCrop[0]);
        return res.status(200).json({
          message: "✅ Crop quantity updated successfully!",
          crop: updatedCrop[0],
        });
      } else {
        return res.status(404).json({ message: "❌ Crop not found after update!" });
      }
    } else {
      return res.status(404).json({ message: "❌ Crop not found for update!" });
    }
  } catch (error) {
    console.error("🔥 Server error:", error);
    return res.status(500).json({ message: "❗ Internal server error." });
  }
});







// ✅ Delete Crop
app.delete("/crops/:id", async (req, res) => {
  const { id } = req.params;

  console.log("🗑️ Deleting Crop ID:", id);

  try {
    const query = "DELETE FROM crops WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ Crop not found" });
    }

    res.status(200).json({ message: "✅ Crop deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting crop:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});





// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
