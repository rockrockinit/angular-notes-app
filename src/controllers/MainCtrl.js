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
    
    // Auto Login Redirect
    if(!$app.getAuth()){
      $location.path('/login');
    }
    
    $app.setTitle('Notes');
    
    this.app = $app;
    
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
     * Determines if a note's value is empty
     */
    $scope.isEmpty = function(val){
      val = (val) ? val.replace(/\<br\s*\/?\>/gi, '').trim() : '';
      return val === '';
    };
  }
]);
