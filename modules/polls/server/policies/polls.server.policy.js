'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Poll Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/polls',
      permissions: '*'
    }, {
      resources: '/api/polls/:pollId',
      permissions: '*'
    }, {
      resources: '/api/polls/:pollId/stat/:opt',
      permissions: ['post']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/polls',
      permissions: ['get', 'post']
    }, {
      resources: '/api/polls/:pollId',
      permissions: ['get']
    }, {
      resources: '/api/polls/:pollId/stat/:opt',
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/polls',
      permissions: ['get']
    }, {
      resources: '/api/polls/:pollId',
      permissions: ['get']
    }, {
      resources: '/api/polls/:pollId/stat/:opt',
      permissions: ['post']
    }]
  }]);
};

/**
 * Check If Polls Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an poll is being processed and the current user created it then allow any manipulation
  if (req.poll && req.user && req.poll.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
