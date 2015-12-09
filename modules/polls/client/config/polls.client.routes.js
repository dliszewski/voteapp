'use strict';

// Setting up route
angular.module('polls').config(['$stateProvider',
  function ($stateProvider) {
    // Polls state routing
    $stateProvider
      .state('polls', {
        abstract: true,
        url: '/polls',
        template: '<ui-view/>'
      })
      .state('polls.list', {
        url: '',
        templateUrl: 'modules/polls/client/views/list-polls.client.view.html'
      })
      .state('polls.create', {
        url: '/create',
        templateUrl: 'modules/polls/client/views/create-poll.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('polls.view', {
        url: '/:pollId',
        templateUrl: 'modules/polls/client/views/view-poll.client.view.html'
      })
      .state('polls.edit', {
        url: '/:pollId/edit',
        templateUrl: 'modules/polls/client/views/edit-poll.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
