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
  function($scope, $timeout, $mdSidenav, $log, $rootScope){
    $scope.close = function(){
      $mdSidenav('right').close();
    };
  }
]);