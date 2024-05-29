const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const User = require('./../models/User')
const path = require('path')

// add fav must be first 
// PUT - add favouriteBook --------------------------------------
router.put('/addFavBook/', Utils.authenticateToken, (req, res) => {  // endpoint would b /user/addFavBook
  // validate check
  if(!req.body.bookId){
    return res.status(400).json({
      message: "No book specified"
    })
  }
  // add bookId to favouriteBooks field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      favouriteBooks: req.body.bookId
    }
  })
    .then((user) => {            
      res.json({
        message: "Book added to favourites"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding favourite book"
      })
    })
})

// PUT - add cartBook --------------------------------------
router.put('/addCaBook/', Utils.authenticateToken, (req, res) => {  // endpoint would b /user/addFavBook
  // validate check
  if(!req.body.bookId){
    return res.status(400).json({
      message: "No book specified"
    })
  }
  // add bookId to favouriteBooks field (array - push)
  User.updateOne({
    _id: req.user._id
  }, {
    $push: {
      cartBooks: req.body.bookId
    }
  })
    .then((user) => {            
      res.json({
        message: "Book added to cart"
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem adding book to cart"
      })
    })
})

// GET - get single user (populating both wishlist and cart fnc) -------------------------------------------------------
router.get('/:id', Utils.authenticateToken, (req, res) => {
  if(req.user._id != req.params.id){
    return res.status(401).json({
      message: "Not authorised"
    })
  }

  User.findById(req.params.id)
  .populate('favouriteBooks cartBooks')
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Couldn't get user",
        error: err
      })
    })
})



// PUT - update user ---------------------------------------------
router.put('/:id', Utils.authenticateToken, (req, res) => {
  // validate request
  if(!req.body) return res.status(400).send("Task content can't be empty")
  
  let avatarFilename = null

  // if avatar image exists, upload!
  if(req.files && req.files.avatar){
    // upload avater image then update user
    let uploadPath = path.join(__dirname, '..', 'public', 'images')
    Utils.uploadFile(req.files.avatar, uploadPath, (uniqueFilename) => {
      avatarFilename = uniqueFilename
      // update user with all fields including avatar
      updateUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: avatarFilename,
        bio: req.body.bio,
        accessLevel: req.body.accessLevel
      })
    })
  }else{
    // update user without avatar
    updateUser(req.body)
  }
  
  // update User
  function updateUser(update){    
    User.findByIdAndUpdate(req.params.id, update, {new: true})
    .then(user => res.json(user))
    .catch(err => {
      res.status(500).json({
        message: 'Problem updating user',
        error: err
      })
    }) 
  }
})

// POST - create new user --------------------------------------
router.post('/', (req, res) => {
  // validate request
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "User content can not be empty"})
  }

  // check account with email doen't already exist
  User.findOne({email: req.body.email})
  .then(user => {
    if( user != null ){
      return res.status(400).json({
        message: "email already in use, use different email address"
      })
    }
  // create new user       
  let newUser = new User(req.body)
  newUser.save()
    .then(user => {        
      // success!  
      // return 201 status with user object
      return res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating account",
        error: err
      })
    })
  })
})

module.exports = router