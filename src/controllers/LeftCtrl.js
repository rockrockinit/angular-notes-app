/**
 * Left Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-15
 */
app.controller('LeftCtrl', [
  '$scope',
  '$timeout',
  '$log',
  '$mdSidenav',
  'AppService',
  '$location',
  function($scope, $timeout, $log, $mdSidenav, $app, $location){
    $log.info('LeftCtrl');
    
    $scope.app = $app;
    
    /**
     * Checks if a note is selected
     *
     * @param object note The note to check
     * @return boolean True if selected
     */
    $scope.isSelected = function(note){
      return (note && $app.note) ? note.id === $app.note.id : 0;
    };
     
    $scope.close = function(){
      $mdSidenav('left').close();
    };
    
    $scope.show = function(note){
      if(!/^\/$/.test($location.$$path)){
        $location.path('/');
      }
      
      $app.show(note);
      $mdSidenav('left').close();
    };
    
    $scope.hide = function(note){
      if($scope.search){
        var regexp = new RegExp($scope.search, 'gi');
        
        return !regexp.test(note.name);
      }
      
      return false;
    };
    
    $scope.auth = $app.getAuth;
  }
]);
