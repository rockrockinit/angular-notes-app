/**
 * Sign Up Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-15
 */
pages.controller('SignupCtrl', [
  '$scope',
  '$location',
  '$mdDialog',
  'fb',
  function($scope, $location, $mdDialog, fb){
    console.log('SignupCtrl');
    
    $scope.email = '';
    $scope.password = '';
    
    $scope.signup = function(){
      var errors = [];
      
      console.log('Sign Up!');
      
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
            title: 'Sign Up Error',
            errors: errors
          },
          controller: ErrorDialog
        });
        
      }else{
        // Sign Up
        fb.createUser({
          email: $scope.email,
          password: $scope.password
        }, function(error, auth){
          if(error){
            console.log('Sign Up Failed', error);
            
            var errors = [];
            errors.push(error.toString().replace(/^Error:/, '').trim());
            
            $mdDialog.show({
              template: dialogs.error,
              locals: {
                title: 'Sign Up Failed',
                errors: errors
              },
              controller: ErrorDialog
            });
          }else{
            console.log('Sign Up Success!', auth);
            
            // Log In
            fb.authWithPassword({
              'email': $scope.email,
              'password': $scope.password
            }, function(error, auth){
              $btn.prop('disabled', false);
      
              if(error){
                console.log('Log In Failed', error);
                
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
        });
      }
      
    };
  }
]);