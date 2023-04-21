const express = require("express");
const {
  addBook,
  addManyBooks,
  getBooks,
  getBook,
  editBook,
  deleteBook,
} = require("../controllers/admin");

const router = express.Router();

// /admin/add-book => POST
router.post("/add-book", addBook);

// /admin/add-books => POST
router.post("/add-books", addManyBooks);

// /admin/books => GET
router.get("/books", getBooks);

// /admin/book/bookId => GET
router.get("/book/:bookId", getBook);

// /admin/edit-book/bookId => GET
router.patch("/edit-book/:bookId", editBook);

// /admin/delete-book/bookId => GET
router.delete("/delete-book/:bookId", deleteBook);

module.exports = router;
