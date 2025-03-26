const db = require("../db");
const bcrypt = require("bcryptjs");

exports.registerSeller = async (req, res) => {
    console.log("📥 Received seller registration request:", req.body);

    const { fullName, phoneNo, city, pincode, email, fullAddress, password } = req.body;

    if (!fullName || !phoneNo || !city || !pincode || !email || !fullAddress || !password) {
        console.log("❌ Missing fields:", { fullName, phoneNo, city, pincode, email, fullAddress, password });
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Hashed password:", hashedPassword);

        const query = "INSERT INTO sellers (full_name, phone_no, city, pincode, email, full_address, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        console.log("🛢️ Executing SQL query:", query, "with values:", [fullName, phoneNo, city, pincode, email, fullAddress, hashedPassword]);

        const [result] = await db.execute(query, [fullName, phoneNo, city, pincode, email, fullAddress, hashedPassword]);

        console.log("✅ Seller inserted successfully! Insert ID:", result.insertId);
        return res.status(201).json({ message: "Seller registered successfully" });

    } catch (err) {
        console.error("❌ Database insert error:", err.sqlMessage || err.message, " | SQL State:", err.sqlState);
        return res.status(500).json({ message: "Internal server error", error: err.sqlMessage || err.message });
    }
};
