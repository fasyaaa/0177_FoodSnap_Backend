const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===================
// REGISTER
// ===================
exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;
  const role = "client";

  console.log("Register payload:", { name, username, email, password });

  try {
    const [existingUsers] = await db.query(
      "SELECT * FROM client WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "Email or Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSQL =
      "INSERT INTO client (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
    console.log("Executing SQL:", insertSQL);

    const [result] = await db.query(insertSQL, [
      name,
      username,
      email,
      hashedPassword,
      role,
    ]);

    //Generate JWT
    const user = {
      id: result.insertId,
      name,
      username,
      email,
      role,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: "Register success", token });
  } catch (err) {
    console.error("Register catch error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// ===================
// LOGIN
// ===================
// ===================
// LOGIN
// ===================
exports.login = async (req, res) => {
  const { identity, password } = req.body;
  console.log("Login payload:", { identity, password });

  try {
    const [results] = await db.query(
      "SELECT * FROM client WHERE email = ? OR username = ?",
      [identity, identity]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user.id_client,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Success",
      status_code: 200,
      data: {
        id: user.id_client,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
  } catch (err) {
    console.error("Login catch error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Optional: Dashboard view
exports.dashboard = (req, res) => {
  res.render("dashboard", { user: req.user });
};
