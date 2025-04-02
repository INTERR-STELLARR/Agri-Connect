const express = require("express");
const db = require("./db"); // Ensure db.js exports a MySQL connection pool
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 5000;

// ✅ CORS Middleware (Allow Frontend Requests)

app.use(cors({
  origin: "http://localhost:5173", // ✅ Allow React App
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Body Parser Middleware
app.use(bodyParser.json());

// ✅ Serve Uploaded Images Correctly
app.use("/uploads", express.static("uploads"));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      const contentTypeMap = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
      };
      res.set("Content-Type", contentTypeMap[ext] || "application/octet-stream");
    },
  })
);

// ✅ LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔍 Login Request Received for Email:", email);

    // ✅ Check if user exists in "buyers" table
    const [buyer] = await db.query("SELECT * FROM buyers WHERE email = ?", [email]);
    console.log("🟢 Buyer Query Result:", buyer);

    if (buyer.length > 0) {
      console.log("✅ Buyer found!");
      const isPasswordValid = await bcrypt.compare(password, buyer[0].password);
      if (!isPasswordValid) {
        console.log("❌ Invalid password for Buyer!");
        return res.status(401).json({ message: "❌ Invalid Password" });
      }

      return res.status(200).json({
        message: "✅ Buyer login successful!",
        role: "buyer",
        user: buyer[0],
      });
    }

    // ✅ Check if user exists in "sellers" table
    const [seller] = await db.query("SELECT * FROM sellers WHERE email = ?", [email]);
    console.log("🟢 Seller Query Result:", seller);

    if (seller.length > 0) {
      console.log("✅ Seller found!");
      const isPasswordValid = await bcrypt.compare(password, seller[0].password);
      if (!isPasswordValid) {
        console.log("❌ Invalid password for Seller!");
        return res.status(401).json({ message: "❌ Invalid Password" });
      }

      console.log("✅ Seller login successful! Returning role...");
      return res.status(200).json({
        message: "✅ Seller login successful!",
        role: "seller",
        user: seller[0],
      });
    }

    // ❌ User Not Found
    console.log("❌ No matching user found!");
    res.status(404).json({ message: "❌ Email not registered!" });

  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ message: "❗ Internal server error." });
  }
});


// ✅ REGISTER (Buyer & Seller)
app.post("/register/:role", async (req, res) => {
  const role = req.params.role.toLowerCase();
  const { fullName, phoneNo, city, pincode, email, fullAddress, password } = req.body;

  if (!["buyer", "seller"].includes(role)) {
    return res.status(400).json({ message: "❌ Invalid role" });
  }

  try {
    const [existing] = await db.query(`SELECT * FROM ${role}s WHERE email = ?`, [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "❌ Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO ${role}s (full_name, phone_no, city, pincode, email, full_address, password) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fullName, phoneNo, city, pincode, email, fullAddress, hashedPassword]
    );

    res.status(201).json({ 
      message: "✅ Registration successful! Redirecting to login page...",
      redirect: "/login"
    });

  } catch (error) {
    console.error("🔥 Registration error:", error);
    res.status(500).json({ message: "❗ Internal server error." });
  }
});

// ✅ GET CROPS for Seller Inventory
app.get("/crops", async (req, res) => {
  const { sellerId } = req.query;

  if (!sellerId) {
    return res.status(400).json({ message: "❗ Seller ID is required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM crops WHERE seller_id = ?", [sellerId]);

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

// ✅ Get Crops by Category (For Buyers)
app.get("/crops-by-category", async (req, res) => {
  const { category } = req.query;

  try {
    let query = `
      SELECT id AS crop_id, crop_name, description, quantity, price, crop_type, image_url 
      FROM crops
    `;
    const params = category ? [category] : [];

    if (category) query += " WHERE crop_type = ?";

    const [rows] = await db.query(query, params);

    // ✅ Convert relative image paths to absolute URLs
    const updatedCrops = rows.map(crop => ({
      ...crop,
      image_url: crop.image_url
        ? `http://localhost:5000${crop.image_url}` // Ensure full path
        : null
    }));

    console.log("✅ API Response with crop_id & full image URL:", updatedCrops);

    res.status(200).json({ crops: updatedCrops });

  } catch (error) {
    console.error("🔥 Error fetching crops by category:", error);
    res.status(500).json({ message: "Internal server error" });
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
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  },
});

const upload = multer({ storage });

// ✅ CROP UPLOAD ENDPOINT
app.post("/crops", upload.single("image"), async (req, res) => {
  let { cropName, description, quantity, price, cropType, sellerId } = req.body;
  sellerId = parseInt(sellerId, 10);

  if (!sellerId || isNaN(sellerId)) {
    return res.status(400).json({ message: "❗ Seller ID is missing or invalid" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "❗ Image is required" });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;

    await db.query(
      `INSERT INTO crops (seller_id, crop_name, description, quantity, price, crop_type, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sellerId, cropName, description, quantity, price, cropType, imageUrl]
    );

    res.status(201).json({ message: "✅ Crop added successfully!", imageUrl });

  } catch (err) {
    console.error("🔥 Error adding crop:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update Crop Quantity
app.put('/crops/:cropId', async (req, res) => {
  const { cropId } = req.params;
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity)) {
    return res.status(400).json({ message: "❗ Invalid quantity value" });
  }

  try {
    const [updateResult] = await db.query(
      "UPDATE crops SET quantity = ? WHERE id = ?",
      [quantity, cropId]
    );

    if (updateResult.affectedRows > 0) {
      const [updatedCrop] = await db.query("SELECT * FROM crops WHERE id = ?", [cropId]);

      if (updatedCrop.length > 0) {
        return res.status(200).json({
          message: "✅ Crop quantity updated successfully!",
          crop: updatedCrop[0],
        });
      }
    }

    res.status(404).json({ message: "❌ Crop not found for update!" });

  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ message: "❗ Internal server error." });
  }
});

// ✅ Delete Crop
app.delete("/crops/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM crops WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ Crop not found" });
    }

    res.status(200).json({ message: "✅ Crop deleted successfully" });

  } catch (error) {
    console.error("🔥 Error deleting crop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//add to cart codes

app.use(express.json()); // ✅ Ensure JSON parsing is enabled

// ✅ ADD TO CART
app.post("/api/cart/add", async (req, res) => {
  console.log("📩 Received Data:", req.body);

  const { buyer_id, crop_id, quantity, price } = req.body;

  if (!buyer_id || !crop_id || !quantity || !price) {
    console.error("❌ Missing required fields:", req.body);
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  if (Number(quantity) < 100) {
    console.error("❌ Minimum quantity required: 100kg");
    return res.status(400).json({ success: false, error: "Minimum 100kg required to add to cart" });
  }

  try {
    // ✅ Check if buyer exists in buyers table
    const [buyer] = await db.query("SELECT id FROM buyers WHERE id = ?", [buyer_id]);
    if (buyer.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid buyer ID" });
    }

    // ✅ Check if crop exists
    const [crop] = await db.query("SELECT id, quantity, price FROM crops WHERE id = ?", [crop_id]);
    if (crop.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid crop ID" });
    }

    // ✅ Check if quantity is available
    if (Number(quantity) > Number(crop[0].quantity)) {
      return res.status(400).json({ success: false, error: "Not enough stock available" });
    }

    const cropPricePerKg = Number(crop[0].price); // Fetch crop price per kg
    const totalPrice = cropPricePerKg * Number(quantity); // Calculate total price

    // ✅ Check if item already exists in cart
    const [existingCartItem] = await db.query(
      "SELECT quantity FROM cart WHERE buyer_id = ? AND crop_id = ?",
      [buyer_id, crop_id]
    );

    if (existingCartItem.length > 0) {
      const newQuantity = Number(existingCartItem[0].quantity) + Number(quantity);
      const newTotalPrice = cropPricePerKg * newQuantity;

      await db.query(
        "UPDATE cart SET quantity = ?, price = ? WHERE buyer_id = ? AND crop_id = ?",
        [newQuantity, newTotalPrice, buyer_id, crop_id]
      );

      return res.json({ success: true, message: "Cart updated successfully!" });
    } else {
      await db.query(
        "INSERT INTO cart (buyer_id, crop_id, quantity, price) VALUES (?, ?, ?, ?)",
        [buyer_id, crop_id, quantity, totalPrice]
      );

      return res.status(201).json({ success: true, message: "Item added to cart successfully!" });
    }
  } catch (error) {
    console.error("🔥 Error adding to cart:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});






// ✅ GET CART ITEMS FOR A BUYER
app.get("/api/cart/:buyerId", async (req, res) => {
  const { buyerId } = req.params;

  try {
    const [cartItems] = await db.query(
      `SELECT cart.id, cart.crop_id, crops.crop_name, cart.quantity, cart.price, crops.image_url 
       FROM cart 
       JOIN crops ON cart.crop_id = crops.id 
       WHERE cart.buyer_id = ?`,
      [buyerId]
    );

    return res.status(200).json({ success: true, cart: cartItems });

  } catch (error) {
    console.error("🔥 Error fetching cart items:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ UPDATE CART ITEM QUANTITY
app.put("/api/cart/update/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ success: false, error: "❗ Invalid quantity value" });
  }

  try {
    const [cartItem] = await db.query("SELECT price, quantity FROM cart WHERE id = ?", [cartId]);

    if (cartItem.length === 0) {
      return res.status(404).json({ success: false, error: "❌ Cart item not found" });
    }

    const pricePerUnit = cartItem[0].price / cartItem[0].quantity;
    const newPrice = pricePerUnit * quantity;

    await db.query("UPDATE cart SET quantity = ?, price = ? WHERE id = ?", [quantity, newPrice, cartId]);

    return res.status(200).json({ success: true, message: "✅ Cart item updated successfully!" });

  } catch (error) {
    console.error("🔥 Error updating cart:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ DELETE CART ITEM
app.post("/api/cart/remove", async (req, res) => {
  const { buyer_id, crop_id } = req.body;
  
  if (!buyer_id || !crop_id) {
      return res.status(400).json({ success: false, error: "Missing buyer_id or crop_id" });
  }

  try {
      // Check if the cart item exists before deletion
      const [cartItem] = await db.query("SELECT * FROM cart WHERE buyer_id = ? AND crop_id = ?", [buyer_id, crop_id]);

      if (cartItem.length === 0) {
          return res.status(404).json({ success: false, error: "Item not found in cart" });
      }

      // Proceed to delete the item
      await db.query("DELETE FROM cart WHERE buyer_id = ? AND crop_id = ?", [buyer_id, crop_id]);

      return res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
      console.error("🔥 Error deleting cart item:", error);
      return res.status(500).json({ success: false, error: "Database error" });
  }
});






// ✅ Start the Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
