const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let {username, password} = req.body;
  if ( username && password){
    if(isValid(username))
    {
      users.push({ "username" : username , "password" : password});
      return res.status(200).json({message: "User registered successfully"});
    } else {
      return res.status(400).json({message: "User already exists"});
    
    }
  } else {
    return res.status(400).json({message: "Invalid input"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});




// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   isbn = req.params.isbn;
    if (books[isbn]){
        return res.send(JSON.stringify(books[isbn]));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  author = req.params.author; 
  booksbyauthor = Object.values(books).filter(book => book.author == author);
  if ( booksbyauthor.length > 0){
    return res.send(JSON.stringify(booksbyauthor));
  } else {
    return res.status(404).json({message: "Author not found"});
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  title = req.params.title;
  booksbytitle = Object.values(books).filter(book => book.title == title);
  if ( booksbytitle.length > 0){
    return res.send(JSON.stringify(booksbytitle));
  } else {
    return res.status(404).json({message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn;
  if (books[isbn]){
    return res.send(JSON.stringify(books[isbn].reviews));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
