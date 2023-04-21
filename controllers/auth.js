const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ email: "A user already registered with this email." });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = User(req.body);
    newUser.save();

    const payload = {
      user: {
        id: newUser._id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          email: newUser.email,
          id: newUser._id,
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    res.status(400).send(error);
  }
};

const signin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        console.log(result);

        const payload = {
          user: {
            id: user._id,
          },
        };

        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600,
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
              email: user.email,
            });
          }
        );
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
      console.log(error);
      res.status(500).send(error)
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
};

module.exports = {
  signup,
  signin,
  getUser,
};
