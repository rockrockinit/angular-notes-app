/**
 * Log In Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-14
 */
pages.controller('LoginCtrl', [
  '$scope',
  '$location',
  '$mdDialog',
  'fb',
  function($scope, $location, $mdDialog, fb){
    console.log('LoginCtrl');
    
    $scope.email = '';
    $scope.password = '';
    
    $scope.login = function(event){
      var errors = [];
      
      if(!$scope.email){
        errors.push('Email is required');
      }
      
      if(!$scope.password){
        errors.push('Password is required');
      }
      
      if(errors.length){
        $mdDialog.show({
          template: dialogs.error,
          locals: {
            title: 'Log In Error',
            errors: errors
          },
          controller: ErrorDialog
        });
      }else{
        var $btn = $(event.currentTarget);
        $btn.prop('disabled', false);
        
        // Log In
        fb.authWithPassword({
          'email': $scope.email,
          'password': $scope.password
        }, function(error, auth){
          $btn.prop('disabled', false);
  
          if(error){
            console.log('Log In Failed!', error);
            
            var errors = [];
            errors.push(error.toString().replace(/^Error:/, '').trim());
            
            $mdDialog.show({
              template: dialogs.error,
              locals: {
                title: 'Log In Failed',
                errors: errors
              },
              controller: ErrorDialog
            });
          }else{
            console.log('Log In Success!', auth);
            $scope.$apply(function() {
              $location.path('/');
            });
          }
        });
      }
      
    };
  }
]);