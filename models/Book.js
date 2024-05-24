const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Utils = require('../utils')

// schema
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String    
  },
  price: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' // brings in user linked to book
  },
  image: {
    type: String,
    required: true    
  },
  gender: {
    type: String,
    required: true
  },
  length: {
    type: String,
    required: true
  }
  
}, { timestamps: true })


// model
const bookModel = mongoose.model('Book', bookSchema)

// export
module.exports = bookModel

