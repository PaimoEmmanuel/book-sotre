const express = require("express");
const {
  addToCart,
  getCart,
  checkout,
  deleteFromCart,
  emptyCart,
} = require("../controllers/shop");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/cart", auth, addToCart);

router.get("/cart", auth, getCart);

router.post("/checkout", auth, checkout);

router.delete("/empty-cart", auth, emptyCart);

router.delete("/delete/:bookId", auth, deleteFromCart);

module.exports = router;
