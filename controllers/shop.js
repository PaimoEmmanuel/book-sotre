const User = require("../models/user");

const addToCart = async (req, res) => {
  const user = await User.findById(req.user.id);
  try {
    await user.addToCart(req.body.bookId, req.body.quantity);
    res.status(200).send({ message: "Book successfully added to cart" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).send(error);
  }
};

const checkout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const cartDetailsPromise = await user.checkout();
    Promise.all(cartDetailsPromise)
      .then((cartDetails) => {
        const orderDetail = {
          cart: cartDetails,
          totalAmount:
            cartDetails.length > 1
              ? cartDetails.reduce((x, y) => x.totalAmount + y.totalAmount)
              : cartDetails[0].totalAmount,
          orderDate: Date(),
        };
        user.emptyCart();
        res
          .status(200)
          .send({ message: "Checkout successful", ...orderDetail });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.deleteFromCart(req.params.bookId);
    res.status(200).send({ message: "Book successfully deleted from cart" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const emptyCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.emptyCart();
    res.status(200).send({ message: "Cart successfully deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = { addToCart, getCart, checkout, deleteFromCart, emptyCart };
