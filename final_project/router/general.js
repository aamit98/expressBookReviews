const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username , password} = req.body; 
  if(username && password){
    if(!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    } 
  } else {
    return res.status(404).json({message: "Unable to register user."});
  }
  
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const getBooks = await new Promise((resolve) => {
    resolve(books);
  });
  res.send(JSON.stringify(getBooks, null, 4));
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    const findBook= new Promise ((resolve,reject)=>{
      if(books[isbn]){
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      } 
    });
    findBook.then((book)=>{
      return res.status(200).json(book);
    }).catch((err)=>{
      return res.status(404).json({message: err});
    } 
    );

 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
     const author = req.params.author;
     try{
      const getBookByAuthor = await new Promise ((resolve, reject) => {
        let result =Object  .values(books).filter((book)=> book.author === author);
        resolve (result);
      });
      res.status(200).send(JSON.stringify(getBookByAuthor,null,4)); 
      } catch(err){ 
        res.status(404).json({message: err});

     }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const getBooksByTitle= new Promise((resolve,reject)=>{
      let result = Object.values(books).filter((book)=> book.title === title);
      resolve (result);
    }); 
    getBooksByTitle.then ((result)=>{ 
      res.status(200).send(JSON.stringify(result,null,4));      
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
      const isbn = req.params.isbn; 
      if  (books[isbn]) { 
        return res.send(JSON.stringify  (books[isbn].reviews,null,4));  
      } else {
        return res.status(404).json({message: "Book not found"});
      }   

});

module.exports.general = public_users;
