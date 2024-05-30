const express = require('express')
const router = express.Router()
const Utils = require('../utils')
const Book = require('./../models/Book')
const path = require('path')

// GET- get all books ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Book.find().populate('user', '_id firstName lastName')
    .then(books => {
      if(books == null){
        return res.status(404).json({
          message: "No books found"
        })
      }
      res.json(books)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting books"
      })
    })  
})

// POST - create new book --------------------------------------
router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "book content can't be empty"})
  }
  // validate - check if image file exist
  if(!req.files || !req.files.image){
    return res.status(400).send({message: "Image can't be empty"})
  }

  console.log('req.body = ', req.body)

  // image file must exist, upload, then create new book - upload file first - path made const var up top 
  let uploadPath = path.join(__dirname, '..', 'public', 'images')
  Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
    // create new book
    let newBook = new Book({
      name: req.body.name,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      user: req.body.user,
      image: uniqueFilename,
      condition: req.body.condition,
      coverType: req.body.coverType,
      year: req.body.year,
      genre: req.body.genre
    })
  
    newBook.save()
    .then(book => {        
      // success!  
      // return 201 status with book object
      return res.status(201).json(book)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating book",
        error: err
      })
    })
  })
})

// export
module.exports = router

