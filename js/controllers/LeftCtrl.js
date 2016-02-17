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
  '$rootScope',
  'AppService',
  function($scope, $timeout, $log, $mdSidenav, $rootScope, $app){
    $log.info('LeftCtrl');
    
    $scope.notes = [];
    $scope.note = {};
    
    /**
     * Checks if a note is selected
     *
     * @param object note The note to check
     * @return boolean True if selected
     */
    $scope.isSelected = function(note){
      return (note && note.id) ? $scope.note.id === note.id : 0;
    };
     
    $scope.close = function(){
      $mdSidenav('left').close();
    };
    
    $scope.show = function(note){
      $app.show(note);
      $mdSidenav('left').close();
    };
    
    $scope.auth = $app.getAuth;
    
    /**
     * Load a note
     */
    $rootScope.$on('load', function(event, notes, note){
      $scope.notes = notes;
      $scope.note = note;
    });
  }
]);