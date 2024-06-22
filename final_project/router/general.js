const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  })
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((err) => res.status(500).send(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const filteredIsbn = books[isbn];
    if (filteredIsbn) {
      resolve(filteredIsbn);
    } else {
      reject("No book found matching the ISBN provided");
    }
  })
    .then((filteredIsbn) => res.send(filteredIsbn))
    .catch((err) => res.status(404).send(err));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const filteredAuthor = Object.values(books).filter(book => book.author === author);
    if (filteredAuthor.length > 0) {
      resolve(filteredAuthor);
    } else {
      reject("No book found matching the author provided");
    }
  })
    .then((filteredAuthor) => res.send(filteredAuthor))
    .catch((err) => res.status(404).send(err));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const filteredTitle = Object.values(books).filter(book => book.title === title);
    if (filteredTitle.length > 0) {
      resolve(filteredTitle);
    } else {
      reject("No book found matching the title provided");
    }
  })
    .then((filteredTitle) => res.send(filteredTitle))
    .catch((err) => res.status(404).send(err));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const filteredIsbn = books[isbn];
  if (filteredIsbn) {
    res.send(filteredIsbn.reviews);
  } else {
    res.send("No book found matching the ISBN provided");
  }
});

module.exports.general = public_users;
