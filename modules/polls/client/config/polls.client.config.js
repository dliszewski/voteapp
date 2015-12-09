'use strict';

// Configuring the Polls module
angular.module('polls').run(['Menus',
  function (Menus) {
    // Add the polls dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Polls',
      state: 'polls',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'polls', {
      title: 'List Polls',
      state: 'polls.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'polls', {
      title: 'Create Polls',
      state: 'polls.create',
      roles: ['user']
    });
  }
]);
