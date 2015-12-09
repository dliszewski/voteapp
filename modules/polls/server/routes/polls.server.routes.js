'use strict';

/**
 * Module dependencies.
 */
var pollsPolicy = require('../policies/polls.server.policy'),
  polls = require('../controllers/polls.server.controller');

module.exports = function (app) {
  // Polls collection routes
  app.route('/api/polls').all(pollsPolicy.isAllowed)
    .get(polls.list)
    .post(polls.create);

  // Single poll routes
  app.route('/api/polls/:pollId').all(pollsPolicy.isAllowed)
    .get(polls.read)
    .put(polls.update)
    .delete(polls.delete);
  app.route('/api/polls/:pollId/stat/:opt').all(pollsPolicy.isAllowed)
      .post(polls.updatestat);
  // Finish by binding the poll middleware
  app.param('pollId', polls.pollByID);
};
