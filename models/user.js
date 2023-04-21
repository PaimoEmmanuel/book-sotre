const mongoose = require("mongoose");

const Book = require("./book");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // select: false,
  },
  cart: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

UserSchema.methods.addToCart = function (bookId, quantity) {
  const bookIndex = this.cart.findIndex(
    (book) => book.bookId.toString() === bookId.toString()
  );
  const newCart = [...this.cart];
  if (bookIndex >= 0) {
    newCart[bookIndex].quantity = quantity
      ? quantity
      : this.cart[bookIndex].quantity + 1;
  } else {
    newCart.push({
      bookId,
      quantity: quantity ? quantity : 1,
    });
  }
  this.cart = newCart;
  return this.save();
};

UserSchema.methods.checkout = async function () {
  try {
    return this.cart.map(async (cartBook) => {
      const book = await Book.findById(cartBook.bookId);
      if (book.quantity < cartBook.quantity) {
        throw new Error(
          `There are only ${book.quantity} copies of ${book.title} in stock.`
        );
      }
      book.quantity = book.quantity - cartBook.quantity;
      if (book.quantity < 1) {
        await Book.deleteOne({ _id: book._id });
      }
      await book.save();
      return {
        title: book.title,
        description: book.description,
        quantity: cartBook.quantity,
        totalAmount: cartBook.quantity * book.amount,
      };
    });
  } catch (error) {
    return error;
  }
};

UserSchema.methods.deleteFromCart = function (bookId) {
  const newcart = this.cart.filter(
    (book) => book.bookId.toString() !== bookId.toString()
  );
  this.cart = newcart;
  return this.save();
};

UserSchema.methods.emptyCart = function () {
  this.cart = [];
  return this.save();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
