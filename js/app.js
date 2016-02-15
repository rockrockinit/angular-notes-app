var ctrls = angular.module('ctrls', []),
  app = angular.module('notesApp', ['ctrls', 'ngRoute', 'contenteditable']),
  firebase_url = 'https://rodriguez.firebaseio.com/notes';

app.factory('fb', [function(){
    return new Firebase(firebase_url);
}]);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).
      when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);

