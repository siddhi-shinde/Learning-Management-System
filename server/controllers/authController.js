const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const transporter = require("../config/nodemailer");

// REGISTER USER

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Validate role
    const allowedRoles = ["student", "instructor"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "student",
    });

    // SEND WELCOME EMAIL
    try {
      await transporter.sendMail({
        from: `"LMS System" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Welcome to Learning Management System",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          ">

            <h2 style="color: #0d6efd;">
              Welcome to LMS 🎓
            </h2>

            <p>
              Hello <strong>${user.name}</strong>,
            </p>

            <p>
              Your account has been successfully created
              in our Learning Management System.
            </p>

            <p>
              <strong>Email:</strong> ${user.email}
            </p>

            <p>
              <strong>Role:</strong> ${user.role}
            </p>

            <p>
              You can now login and start using the LMS.
            </p>

            <hr />

            <p>
              Thank you,<br />
              <strong>LMS Team</strong>
            </p>

          </div>
        `,
      });

      console.log(`Welcome email sent to ${user.email}`);
    } catch (emailError) {
      // Email failed, but registration was successful
      console.error("Welcome Email Error:", emailError.message);
    }
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN USER

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check active status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Store token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

  return res.status(200).json({
  success: true,
  message: "Login successful",
  token: token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
  },
});
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET PROFILE
const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// LOGOUT USER
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser
};