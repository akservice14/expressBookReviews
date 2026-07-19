const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// async version`
public_users.get("/async-books", async function (req, res) {
  try {
    let result = await axios.get("http://localhost:5000/");
    return res.status(200).send(JSON.stringify(result.data, null, 4));
  } catch {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// async version
public_users.get("/async-isbn/:isbn", async function (req, res) {
  try {
    let result = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.status(200).json(result.data);
  } catch {
    return res.status(500).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let booksArray = Object.values(books);
  let booksFound = booksArray.filter((book) => book.author === author);
  if (booksFound.length > 0) {
    return res.status(200).send(JSON.stringify(booksFound, null, 4));
  } else {
    return res.status(404).json({ message: "Books not found" });
  }
});

// async version
public_users.get("/async-author/:author", async function (req, res) {
  try {
    let result = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.status(200).send(JSON.stringify(result.data, null, 4));
  } catch {
    return res.status(500).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let booksArray = Object.values(books);
  let booksFound = booksArray.filter((book) => book.title === title);
  if (booksFound.length > 0) {
    return res.status(200).send(JSON.stringify(booksFound, null, 4));
  } else {
    return res.status(404).json({ message: "Books not found" });
  }
});

// async version
public_users.get("/async-title/:title", async function (req, res) {
  try {
    let result = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    return res.status(200).send(JSON.stringify(result.data, null, 4));
  } catch {
    return res.status(500).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
