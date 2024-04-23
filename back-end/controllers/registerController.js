const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();
exports.sign_up = [
  // Validate and sanitize form
  body("pseudo")
    .notEmpty()
    .withMessage("Pseudo is required")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Pseudo max length is 20 char")
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should be a correct email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be min 8 char long"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        errors: errors.array(),
      });
    } else {
      //check if email is already used
      let user = await User.findOne({ email: req.body.email }).exec();
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }

      //check if pseudo already used
      user = await User.findOne({ pseudo: req.body.pseudo }).exec();
      if (user) {
        return res.status(400).json({ message: "Pseudo already exists." });
      }

      // creating new user
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hashedPassword,
      });

      // save user
      await newUser.save();

      res.json({ message: "User successfully registered" });
    }
  }),
];

exports.sign_in = [
  // Validate and sanitize form
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email should be a correct email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be min 8 char long"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        errors: errors.array(),
      });
    } else {
      // checking email
      const user = await User.findOne({ email: req.body.email }).exec();
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
      //checking password
      const passwordCheck = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCheck) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
      const token = jwt.sign({ user: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res
        .cookie("jwt", token, {
          httpOnly: true,
          secure: false,
        })
        .json({ message: "Successfully logged-in" });
    }
  }),
];
