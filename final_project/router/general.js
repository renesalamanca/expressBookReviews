const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Retrieve the ISBN parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;

    // Convert the books object to an array of its values
    const booksArray = Object.values(books);

    let bookbyisbn = booksArray.filter(book => book.isbn === isbn);
    res.send(JSON.stringify(bookbyisbn));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Retrieve the author parameter from the request URL and send the corresponding book's details
  const author = req.params.author;

  // Convert the books object to an array of its values
  const booksArray = Object.values(books);

  let booksByAuthor = [];

  booksArray.forEach(book => {
    if (book["author"] === author) {
        booksByAuthor.push(book);
    }
  });
  res.send(JSON.stringify(booksByAuthor));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    // Retrieve the author parameter from the request URL and send the corresponding book's details
    const title = req.params.title;
  
    // Convert the books object to an array of its values
    const booksArray = Object.values(books);
  
    let booksByTitle = [];
  
    booksArray.forEach(book => {
      if (book["title"] === title) {
        booksByTitle.push(book);
      }
    });
    res.send(JSON.stringify(booksByTitle));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the ISBN parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;

  // Convert the books object to an array of its values
  const booksArray = Object.values(books);

  let bookbyisbn = booksArray.filter(book => book.isbn === isbn);
  res.send(JSON.stringify(bookbyisbn["reviews"]));
});

module.exports.general = public_users;
