const Book = require("../models/book");

const addBook = async (req, res) => {
  const book = new Book(req.body);
  try {
    await book.save();
    res.send({
      message: "Book successfully added",
      book,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const addManyBooks = async (req, res) => {
  try {
    Book.insertMany(req.body)
      .then((books) => {
        res.send({
          message: "Books successfully added",
          books,
        });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getBooks = async (req, res) => {
  const books = await Book.find({});
  try {
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getBook = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  try {
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
};
const editBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.bookId, req.body);
  const newBook = await Book.findById(req.params.bookId);
  try {
    res.send({
      message: "Book successfully updated",
      newBook,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteBook = async (req, res) => {
  try {
    const deletetedBook = await Book.deleteOne({ _id: req.params.bookId });
    res.send({
      message: "Book successfully deleted",
    });
    res.send({
      message: "Book not found",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  addBook,
  addManyBooks,
  getBooks,
  getBook,
  editBook,
  deleteBook,
};
