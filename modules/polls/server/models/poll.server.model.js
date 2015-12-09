'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Poll Schema
 */
var PollSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    required: 'Title cannot be blank'
  },
  options: {
    type: [ { name: String, votes: Number } ],
    required: 'Options cannot be empty'
  },
  voted:[{
    type: String
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Poll', PollSchema);
