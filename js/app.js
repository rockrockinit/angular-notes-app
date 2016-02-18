var pages = angular.module('pages', []),
    firebase_url = 'https://rodriguez.firebaseio.com/notes',
    app = angular.module('NotesApp', [
      'pages',
      'ngMdIcons',
      'ngMaterial',
      'ngMessages',
      'material.svgAssetsCache',
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
      otherwise({
        redirectTo: '/'
      });
}]);

app.factory('fb', ['$location', '$log', function($location, $log){
  var fb = new Firebase(firebase_url);
    
  fb.onAuth(function(auth) {
    if(auth){
      $log.info("Logged In");
    }else{
      $log.warn("Logged Out!");
      $location.path('/login');
    }
  });

  return fb;
}]);