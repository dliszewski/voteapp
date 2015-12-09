'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Poll = mongoose.model('Poll'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a article
 */
exports.create = function (req, res) {
  var poll = new Poll(req.body);
  poll.user = req.user;

  poll.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(poll);
    }
  });
};

/**
 * Show the current poll
 */
exports.read = function (req, res) {
  res.json(req.poll);
};

/**
 * Update a poll
 */
exports.update = function (req, res) {
  var poll = req.poll;

  poll.title = req.body.title;
  poll.options = req.body.options;

  poll.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(poll);
    }
  });
};

/**
 * Update a poll stat
 */
exports.updatestat = function (req, res) {
    var id = req.params.pollId;
    var optionIndex = req.params.opt;
    console.log(id+optionIndex);
    Poll.findById(id, function (err, poll) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!poll) {
            return res.status(404).send('Not Found');
        }
        if(req.user === undefined || req.user === null){
            poll.options[optionIndex].votes = poll.options[optionIndex].votes + 1;
        }else{
            if(poll.voted.indexOf(req.user._id)===-1){
                poll.voted.push(req.user._id);
                poll.options[optionIndex].votes = poll.options[optionIndex].votes + 1;
            }
        }

        poll.markModified('options');
        poll.save(function (err, newPoll) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            return res.status(200).json(newPoll);
        });
    });
};
/**
 * Delete an poll
 */
exports.delete = function (req, res) {
  var poll = req.poll;

  poll.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(poll);
    }
  });
};

/**
 * List of Polls
 */
exports.list = function (req, res) {
  Poll.find().sort('-created').populate('user', 'displayName').exec(function (err, polls) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(polls);
    }
  });
};

/**
 * Poll middleware
 */
exports.pollByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Poll is invalid'
    });
  }

  Poll.findById(id).populate('user', 'displayName').exec(function (err, poll) {
    if (err) {
      return next(err);
    } else if (!poll) {
      return res.status(404).send({
        message: 'No poll with that identifier has been found'
      });
    }
    req.poll = poll;
    next();
  });
};
