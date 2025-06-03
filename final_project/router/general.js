const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

const baseUrl = "http://localhost:5000"; // Simulated base URL for axios

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


// Task 10: Async/Await - Get all books using Axios
public_users.get('/async-books', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/`);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Task 11: Async/Await - Get book by ISBN using Axios
public_users.get('/async-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${baseUrl}/isbn/${isbn}`);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Async/Await - Get books by author using Axios
public_users.get('/async-author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`${baseUrl}/author/${author}`);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(404).json({ message: "Author not found" });
  }
});

// Task 13: Async/Await - Get books by title using Axios
public_users.get('/async-title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`${baseUrl}/title/${title}`);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(404).json({ message: "Title not found" });
  }
});

module.exports.general = public_users;