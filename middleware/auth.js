const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authorization = req.header("Authorization");
  const token = authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Auth Error" });
  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(500).send({ message: "Invalid Token" });
  }
};
module.exports = auth;
