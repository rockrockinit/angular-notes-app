/**
 * Right Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-15
 */
app.controller('RightCtrl', [
  '$scope',
  '$timeout',
  '$mdSidenav',
  '$log',
  '$rootScope',
  'fb',
  'AppService',
  function($scope, $timeout, $mdSidenav, $log, $rootScope, fb, $app){
    $log.info('RightCtrl');
    
    $scope.close = function(){
      $mdSidenav('right').close();
    };
    
    $scope.logout = function(){
      $app.logout();
      $mdSidenav('right').close();
    }
  }
]);