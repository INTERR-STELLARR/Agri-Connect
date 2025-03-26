const db = require("../db");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Login request received for:", email);

        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
