const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

const getAllBooks = () => {
  return books;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  } else if (doesExist(username)) {
    return res.status(404).json({ message: "user already exists." });
  } else {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "User successfully registered.  Please login." });
  }
});

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  /*try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e);
  }*/
  const getBooks = () => {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve(books);
  },1000);
    })
}
getBooks().then((books) => {
    res.json(books);
}).catch((err) =>{
  res.status(500).json({error: "An error occured"});
});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
 /* const targetISBN = parseInt(req.params.isbn);
  const targetBook = await books[targetISBN];
  if (!targetBook) {
    return res.status(404).json({ message: "ISBN not found." });
  } else {
    return res.status(200).json(targetBook);
  }*/
  const ISBN = req.params.isbn;
  const booksBasedOnIsbn = (ISBN) => {
      return new Promise((resolve,reject) =>{
        setTimeout(() =>{
          const book = books.find((b) => b.isbn === ISBN);
          if(book){
            resolve(book);
          }else{
            reject(new Error("Book not found"));
          }},1000);
      });
  
          
  }
  booksBasedOnIsbn(ISB).then((book) =>{
    res.json(book);
  }).catch((err)=>{
    res.status(400).json({error:"Book not found"})
  });
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  // get array of matching book objects
 /* const matchingBooks = Object.values(await books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books by that author." });
  }*/
  const author = req.params.author;
  const booksBasedOnAuthor = (auth) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const filteredbooks = books.filter((b) => b.author === auth);
            if(filteredbooks>0){
              resolve(filteredbooks);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnAuthor(author).then((book) =>{
      res.json(book);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  /*const matchingTitle = Object.values(await books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];
  if (matchingTitle) {
    return res.status(200).json(matchingTitle);
  } else {
    return res.status(404).json({ message: "Title not found." });
  }*/
  const title = req.params.title;
  const booksBasedOnTitle = (booktitle) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const filteredbooks = books.filter((b) => b.title === booktitle);
            if(filteredbooks>0){
              resolve(filteredbooks);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnTitle(title).then((new_books) =>{
      res.json(new_books);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });

});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const targetISBN = req.params.isbn;
  const targetBook = books[targetISBN];
  if (targetBook) {
    return res.status(200).send(JSON.stringify(targetBook.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});

module.exports.general = public_users;

