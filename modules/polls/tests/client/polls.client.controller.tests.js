'use strict';

(function () {
  // Polls Controller Spec
  describe('Polls Controller Tests', function () {
    // Initialize global variables
    var PollsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Polls,
      mockPoll;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Polls_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Polls = _Polls_;

      // create mock poll
      mockPoll = new Polls({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Poll about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Polls controller.
      PollsController = $controller('PollsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one poll object fetched from XHR', inject(function (Polls) {
      // Create a sample polls array that includes the new poll
      var samplePolls = [mockPoll];

      // Set GET response
      $httpBackend.expectGET('api/polls').respond(samplePolls);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.polls).toEqualData(samplePolls);
    }));

    it('$scope.findOne() should create an array with one poll object fetched from XHR using a pollId URL parameter', inject(function (Polls) {
      // Set the URL parameter
      $stateParams.pollId = mockPoll._id;

      // Set GET response
      $httpBackend.expectGET(/api\/polls\/([0-9a-fA-F]{24})$/).respond(mockPoll);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.poll).toEqualData(mockPoll);
    }));

    describe('$scope.create()', function () {
      var samplePollPostData;

      beforeEach(function () {
        // Create a sample poll object
        samplePollPostData = new Polls({
          title: 'An Poll about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Poll about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Polls) {
        // Set POST response
        $httpBackend.expectPOST('api/polls', samplePollPostData).respond(mockPoll);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the poll was created
        expect($location.path.calls.mostRecent().args[0]).toBe('polls/' + mockPoll._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/polls', samplePollPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock poll in scope
        scope.poll = mockPoll;
      });

      it('should update a valid poll', inject(function (Polls) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/polls\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/polls/' + mockPoll._id);
      }));

      it('should set scope.error to error response message', inject(function (Polls) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/polls\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(poll)', function () {
      beforeEach(function () {
        // Create new polls array and include the poll
        scope.polls = [mockPoll, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/polls\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockPoll);
      });

      it('should send a DELETE request with a valid pollId and remove the poll from the scope', inject(function (Polls) {
        expect(scope.polls.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.poll = mockPoll;

        $httpBackend.expectDELETE(/api\/polls\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to polls', function () {
        expect($location.path).toHaveBeenCalledWith('polls');
      });
    });
  });
}());
