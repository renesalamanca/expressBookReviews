const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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

// Simulate a database call using a Promise
const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000); // Simulate network latency
    });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    getBooks()
        .then(bookList => {
            res.status(200).send(JSON.stringify(bookList, null, 4));
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    getBooks()
        .then(bookList => {
            const booksArray = Object.values(bookList);
            let bookbyisbn = booksArray.filter(book => book.isbn === isbn);
            if (bookbyisbn.length > 0) {
                res.status(200).send(JSON.stringify(bookbyisbn[0]));
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book details" });
        });
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const bookList = await getBooks(); // Wait for the promise to resolve
        const booksArray = Object.values(bookList);
        
        let booksByAuthor = booksArray.filter(book => book.author === author);

        if (booksByAuthor.length > 0) {
            res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
        } else {
            res.status(404).json({ message: "No books found by that author." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author." });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const bookList = await getBooks(); // Wait for the promise to resolve
        const booksArray = Object.values(bookList);
        
        let booksByTitle = booksArray.filter(book => book.title === title);

        if (booksByTitle.length > 0) {
            res.status(200).send(JSON.stringify(booksByTitle, null, 4));
        } else {
            res.status(404).json({ message: "No books found with that title." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title." });
    }
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
