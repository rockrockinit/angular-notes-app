/**
 * Right Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-15
 */
app.controller('RightCtrl', [
  '$scope',
  '$mdSidenav',
  '$mdDialog',
  '$log',
  'AppService',
  function($scope, $mdSidenav, $mdDialog, $log, $app){
    $log.info('RightCtrl');
    
    $scope.close = function(){
      $mdSidenav('right').close();
    };
    
    $scope.logout = function(){
      $mdDialog.show({
        templateUrl: 'views/dialogs/loading.html',
        locals: {
          title: 'Logging Out...'
        },
        parent: 'body',
        controller: LoadingDialog,
        onComplete: function(){
          $app.logout();
          $mdSidenav('right').close();
        }
      });
    }
  }
]);
