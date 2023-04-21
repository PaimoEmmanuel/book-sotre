const express = require("express");
const { check, validationResult } = require("express-validator");
const { signup, signin, getUser } = require("../controllers/auth");
const auth = require("../middleware/auth");

const router = express.Router();

// /auth/signup => POST
router.post(
  "/signup",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  signup
);

// /auth/signin => POST
router.post(
  "/signin",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  signin
);

router.get("/me", auth, getUser);

module.exports = router;
