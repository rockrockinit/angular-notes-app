/**
 * Main Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-14
 */
pages.controller('MainCtrl', [
  '$scope',
  '$location',
  '$rootScope',
  '$log',
  'AppService',
  function($scope, $location, $rootScope, $log, $app){
    $log.info('MainCtrl');
    
    $app.setTitle('Notes');
    
    $scope.notes = [];
    $scope.note = {};
    
     /**
    * Formats a mysql date
    *
    * @param string date THe mysql date
    * @param string pattern The formatted pattern
    * @return string The formatted date
    */
    $scope.formatDate = function(date, pattern){
      return moment(date).format(pattern);
    };
    
    /**
     * Update a note
     */
    $scope.update = function(){
      $app.update(this.note);
    };
    
    /**
     * Remove a note
     */
    $scope.remove = function(){
      $app.remove(this.note);
    };
    
    $scope.isEmpty = function(val){
      val = val || '';
      val = val.replace(/\<br\s*\/?\>/gi, '').trim();
      return val === '';
    };
    
    /**
     * Load a note
     */
    $rootScope.$on('load', function(event, notes, note){
      $scope.notes = notes;
      $scope.note = note;
    });
    
    $app.init();
  }
]);
