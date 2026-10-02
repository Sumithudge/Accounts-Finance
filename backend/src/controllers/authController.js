import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        username,
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};