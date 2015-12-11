'use strict';

// Polls controller
angular.module('polls').controller('PollsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Polls','$http',
  function ($scope, $stateParams, $location, Authentication, Polls,$http) {
    $scope.labels = [];
    $scope.data = [];
    $scope.formData=[];
    $scope.link=$location.absUrl();
    $scope.filters='';

    $scope.save2 = function () {
      if($scope.formData.chickenEgg){
      console.log('poszlo');
      var tv = $scope.poll.options[$scope.formData.chickenEgg].votes;
      $scope.poll.options[$scope.formData.chickenEgg].votes = tv;
      console.log($scope.poll);
      $http.post('/api/polls/' + $scope.poll._id + '/stat/' + $scope.formData.chickenEgg).success(function (data) {
        $scope.labels = [];
        $scope.data = [];
        angular.forEach(data.options, function (value, key) {
          $scope.labels.push(value.name);
          $scope.data.push(value.votes);
        });
        $scope.voted = true;
      });
      }
    };


    $scope.authentication = Authentication;


    $scope.choices = {};
    $scope.choices.type = [ { name: '', votes: 0 }, { name: '', votes:0 } ];
    $scope.addNewChoice = function() {
      var newItemNo = $scope.choices.type.length+1;
      $scope.choices.type.push({ name:'', votes:0 });
    };

    // Create new Poll
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'pollForm');

        return false;
      }
      console.log($scope);
      // Create new Poll object
      var opt =[];
      for (var i=0;i<$scope.choices.type.length;i++){
        opt.push({ name: $scope.choices.type[i].name, votes: 0 });
      }
      console.log(opt);
      var poll = new Polls({
        title: this.title,
        options: opt,
        voted: []
      });


      // Redirect after save
      poll.$save(function (response) {
        $location.path('polls/' + response._id);

        // Clear form fields
        $scope.title = '';
        for (var i=0;i<$scope.counter;i++){
          $scope.options[i]='';
        }
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Poll
    $scope.remove = function (poll) {
      if (poll) {
        poll.$remove();

        for (var i in $scope.polls) {
          if ($scope.polls[i] === poll) {
            $scope.polls.splice(i, 1);
          }
        }
      } else {
        $scope.poll.$remove(function () {
          $location.path('polls');
        });
      }
    };

    // Update existing Poll
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'pollForm');

        return false;
      }

      var poll = $scope.poll;
      console.log(poll);

      poll.$update(function () {
        $location.path('polls/' + poll._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Polls
    $scope.find = function () {
      $scope.polls = Polls.query();
      console.log($scope.polls);
    };

    // Find existing Poll
    $scope.findOne = function () {
      $scope.poll = Polls.get({
        pollId: $stateParams.pollId
      }, function success(data) {
        $scope.labels = [];
        $scope.data = [];
        angular.forEach(data.options, function (value, key) {
          $scope.labels.push(value.name);
          $scope.data.push(value.votes);
          console.log(value.name + ': ' + value.votes);
        });
        if (typeof $scope.authentication.user === 'string') {
          $scope.voted = false;
        } else {
          console.log($scope.poll.voted.indexOf($scope.authentication.user._id));
          console.log($scope.authentication.user._id + ' | ' + $scope.poll.voted);
          if ($scope.poll.voted.indexOf($scope.authentication.user._id) === -1) {
            $scope.voted = false;
          } else {
            $scope.voted = true;
          }
        }
      });

    };
  }
]);
