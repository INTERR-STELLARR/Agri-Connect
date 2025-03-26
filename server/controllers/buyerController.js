const db = require("../db");
const bcrypt = require("bcryptjs");

exports.registerBuyer = async (req, res) => {
    const { fullName, phoneNo, city, pincode, email, fullAddress, password } = req.body;

    if (!fullName || !phoneNo || !city || !pincode || !email || !fullAddress || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = "INSERT INTO buyers (full_name, phone_no, city, pincode, email, full_address, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await db.execute(query, [fullName, phoneNo, city, pincode, email, fullAddress, hashedPassword]);

        return res.status(201).json({ message: "Buyer registered successfully" });
    } catch (err) {
        console.error("Database insert error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
