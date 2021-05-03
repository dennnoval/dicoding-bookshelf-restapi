"use strict"

const router = require("express").Router()
const handler = require("./handler")

// Insert new book
router.post("/books", handler.insertBook)

// Get all books
router.get("/books", handler.getAllBooks)

// Get book by id
router.get("/books/:bookId", handler.getBookById)

// Update book by id
router.put("/books/:bookId", handler.updateBook)

// Delete book by id
router.delete("/books/:bookId", handler.deleteBook)

module.exports = router
