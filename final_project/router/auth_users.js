const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 if (users.filter(user => user.username == username).length == 0){
   return true;
 } else {  
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if (users.filter(user => user.username == username && user.password == password).length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let {username, password} = req.body;
  if ( username && password){
    if(authenticatedUser(username,password))
    {
      let token = jwt.sign(
        {data : password}, 'access', { expiresIn: 60 * 60 }
      );
      req.session.authorized = { token , username };
      return res.status(200).json({message: "User logged in successfully"});
    } else {
      return res.status(208).json({message: "username or password incorrect "});
    }
  } else {
    return res.status(400).json({message: "Invalid input"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let {user, review} = req.body;
  if (isbn && user && review){
    if (books[isbn]){
      books[isbn]["reviews"][user] = review;
      return res.status(200).json({message: "Review added successfully"});
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } else {
    return res.status(400).json({message: "Invalid input"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let user = req.session.authorized.username;
  console.log(isbn)
  if (isbn && user){
    if (books[isbn]){
      if (books[isbn]["reviews"][user]){
        console.log(books[isbn]["reviews"][user])
        delete books[isbn]["reviews"][user];
        return res.status(200).json({message: "Review deleted successfully"});
      } else {
        return res.status(404).json({message: "User not found"});
      }
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } else {
    return res.status(400).json({message: "Invalid input"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
