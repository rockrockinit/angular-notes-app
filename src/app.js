var pages = angular.module('pages', []),
    firebase_url = 'https://rodriguez.firebaseio.com/notes',
    app = angular.module('NotesApp', [
      'pages',
      'ngMdIcons',
      'ngMaterial',
      'ngMessages',
      'ngRoute',
      'contenteditable'
    ]);

app.config([
  '$routeProvider',
  '$mdThemingProvider',
  function($routeProvider, $mdThemingProviders){
    $mdThemingProviders.theme('default')
      .primaryPalette('blue')
      .accentPalette('lime');
      
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
      when('/export', {
        templateUrl: 'views/export.html',
        controller: 'ExportCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);

app.factory('fb', [function(){
  return new Firebase(firebase_url);
}]);
