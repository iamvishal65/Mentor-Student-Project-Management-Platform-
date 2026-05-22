const { createNewProfile } = require("../services/profile.services");
const {
  createUser,
  checkUser,
  checkLoggedIn,
} = require("../services/user.services");
const { createToken } = require("../utils/token.util");
const loginSchema = require("../validators/loginSchema");


const userSchema = require("../validators/userSchema");

async function Register(req, res) {
  try {
    const validateUser = userSchema.safeParse(req.body);
    if (!validateUser.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validateUser.error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
          success: false,
        })),
      });
    }
    const data = validateUser.data;
    const user = await createUser(data);
    await createNewProfile(data,user._id);
    if (user.error) {
      return res.status(400).json({ message: user.error, success: false });
    }
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("error is:" + error);
    res.status(500).json({ message: error.message, success: false });
  }
}

async function Login(req, res) {
  try {
    const validateUser = loginSchema.safeParse(req.body);
    if (!validateUser.success) {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        errors: validateUser.error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }
    const data = validateUser.data;

    const user = await checkUser(data);
    if (user.error) {
      return res.status(400).json({ message: user.error, success: false });
    }
    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in",
      success: true,
      userId: user._id,
    });
  } catch (error) {
    console.error("error is:" + error);
    res.status(500).json({ message: error.message, success: false });
  }
}

async function loginCheck(req, res) {
  try {
    const userId = req.token.id;
    if (!userId) {
      return res
        .status(401)
        .json({ loggedIn: false, message: "Invalid token" });
    }
    const user = await checkLoggedIn(userId);
    if (!user) {
      return res
        .status(401)
        .json({ loggedIn: false, message: "user not found,invalid token" });
    }
    return res.status(200).json({ loggedIn: true, user, message: "logged in" });
  } catch (error) {
    console.log("loginCheck error", error);

    return res.status(500).json({ loggedIn: false, message: "server error" });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("error is:" + error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { Register, Login, loginCheck, logout };
