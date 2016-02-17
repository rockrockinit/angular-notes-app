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

var dialogs = {
  error: '<md-dialog aria-label="{{title}}" style="min-width:290px">\
    <md-toolbar>\
      <div class="md-toolbar-tools">\
        <h2><span>{{title}}</span></h2>\
      </div>\
    </md-toolbar>\
    <md-dialog-content style="padding:25px 30px">\
      <ul style="margin:0px;padding:0px 0px 0px 10px;">\
        <li ng-repeat="error in errors">{{error}}</li>\
      </ul>\
    </md-dialog-content>\
    <md-dialog-actions>\
      <md-button ng-click="closeDialog()" class="md-primary">OK</md-button>\
    </md-dialog-actions>\
  </md-dialog>'
};

function ErrorDialog($scope, $mdDialog, title, errors){
  $scope.title = title;
  $scope.errors = errors;
  
  $scope.closeDialog = function(){
    $mdDialog.hide();
  }
}

app.factory('fb', [function(){
  return new Firebase(firebase_url);
}]);