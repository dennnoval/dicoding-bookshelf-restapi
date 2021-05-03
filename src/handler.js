"use strict"

const bookShelf = require("./bookShelf")
const { nanoid } = require("nanoid")

const handler = {
	insertBook: (req, res) => {
		const id = nanoid(16)
		const insertedAt = new Date().toISOString()
		const updatedAt = new Date().toISOString()
		const { name, year, author, summary, publisher, 
			pageCount, readPage, reading } = req.body
		const finished = readPage === pageCount ? true : false
		const newBook = {
			id, name, year, author, summary, publisher, pageCount, 
			readPage, finished, reading, insertedAt, updatedAt
		}
		bookShelf.push(newBook)
		// Make sure uniqueness book ids (no duplicated)
		const isInserted = bookShelf.filter((book) => book.id === newBook.id).length === 1
		if (newBook.name === undefined || newBook.name == "") {
			res.status(400)
	    res.json({
        "status": "fail",
        "message": "Gagal menambahkan buku. Mohon isi nama buku"
    	})
		} else if (readPage > pageCount) {
			res.status(400)
	    res.json({
        "status": "fail",
        "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    	})
		} else {
			if (isInserted) {
				res.status(201)
				res.json({
		      status: "success",
		      message: "Buku berhasil ditambahkan",
		      data: {
		        bookId: newBook.id
		      }
		  	})
			} else {
				res.status(500)
			  res.json({
		      "status": "fail",
		      "message": "Buku gagal ditambahkan"
		  	})
	  	}
		}
		res.end()
	},
	getAllBooks: (req, res) => {
		res.status(200)
		if (Object.getOwnPropertyNames(req.query).length === 0) {
			res.json({
				status: "success",
				data: { books: 
					bookShelf.forEach(b => new Object({
						id: b.id, 
						name: b.name, 
						publisher: b.publisher
					}))
				}
			})
		} else {
			Object.entries(req.query).forEach(([key, val]) => {
				let val2 = undefined
				if (val.length === 1)
					val2 = parseInt(val) === 1 ? true : false
				switch (key) {
					case "reading": 
						const readBooks = bookShelf.filter(b => b.reading === val2)
						res.json({
							status: "success",
							data: { books : readBooks }
						})
						break
					case "finished": 
						const finishedBooks = bookShelf.filter(b => b.finished === val2)
						finishedBooks
						res.json({
							status: "success",
							data: { 
								name: finishedBooks.name, 
								publisher: finishedBooks.publisher
							}
						})
						break
					case "name": 
						const namedBooks = bookShelf.filter(b => b.name === val2)
						res.json({
							status: "success",
							data: { books: namedBooks }
						})
						break
				}
			})
		}
		res.end()
	},
	getBookById: (req, res) => {
		const { bookId } = req.params
		const book = bookShelf.filter((book) => book.id === bookId)[0]
		if (book !== undefined) {
			res.status(200)
			res.json({
				status: "success",
				data: { book: book }
			})
		} else {
			res.status(404)
			res.json({
				status: "fail",
				message: "Buku tidak ditemukan"
			})
		}
		res.end()
	},
	updateBook: (req, res) => {
		const { bookId } = req.params
		const updatedAt = new Date().toISOString()
		const { name, year, author, summary, publisher, 
			pageCount, readPage, reading } = req.body
		// Find array index which contains equivalent book ids
		const idx = bookShelf.findIndex((book) => book.id === bookId)
		if (idx !== -1) {
			if (name === undefined || name == "") {
				res.status(400)
		    res.json({
	        "status": "fail",
	        "message": "Gagal memperbarui buku. Mohon isi nama buku"
	    	})
			} else if (readPage > pageCount) {
				res.status(400)
		    res.json({
	        "status": "fail",
	        "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
	    	})
			} else {
				bookShelf[idx] = {
					...bookShelf[idx],
					name, year, author, summary, publisher,
					pageCount, readPage, reading, updatedAt
				}
				res.status(200)
				res.json({
		      status: "success",
		      message: "Buku berhasil diperbarui"
		  	})
	  	}
		} else {
			res.status(404)
		  res.json({
		    "status": "fail",
		    "message": "Gagal memperbarui buku. Id tidak ditemukan"
			})
		}
		res.end()
	},
	deleteBook: (req, res) => {
		const { bookId } = req.params
		// Find array index which contains equivalent book ids
		const idx = bookShelf.findIndex((book) => book.id === bookId)
		if (idx !== -1) {
			bookShelf.splice(idx, 1)
			res.status(200)
			res.json({
	      status: "success",
	      message: "Buku berhasil dihapus"
	  	})
		} else {
			res.status(404)
		  res.json({
		    "status": "fail",
		    "message": "Buku gagal dihapus. Id tidak ditemukan"
			})
		}
		res.end()
	},
	getAllReadingBooks: (req, res) => {
		const { reading } = req.query
		const state = reading == 1 ? true : false
		const readBooks = bookShelf.filter(book => book.reading === state)
		res.status(200)
		res.json({
			status: "success",
			data: { books: readBooks }
		})
		console.log(reading)
		res.end()
	},
	getAllFinishedBooks: (req, res) => {
		const finished = req.query.finished
		console.log(finished)
	},
	getAllBooksByName: (req, res) => {
		const { name } = req.query
		console.log(name)
	}
}

module.exports = handler
