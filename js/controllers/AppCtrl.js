/**
 * App Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-15
 */
app.controller('AppCtrl', [
  '$scope',
  '$timeout',
  '$mdSidenav',
  '$log',
  '$rootScope',
  function($scope, $timeout, $mdSidenav, $log, $rootScope){
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };
    
    function debounce(func, wait, context){
      var timer;
      return function debounced(){
        var context = $scope, args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function(){
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    
    function buildDelayedToggler(navID){
      return debounce(function(){
        $mdSidenav(navID).toggle();
      }, 200);
    }
    
    function buildToggler(navID){
      return function(){
        $mdSidenav(navID).toggle();
      };
    }
  }
]);