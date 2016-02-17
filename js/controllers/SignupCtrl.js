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
  '$log',
  'AppService',
  'fb',
  function($scope, $location, $mdDialog, $log, $app, fb){
    $log.info('SignupCtrl');
    
    $app.setTitle('Sign up for Notes');
    
    $scope.email = '';
    $scope.password = '';
    
    $scope.signup = function(e){
      var submit = true;
          
      if(e && e.currentTarget && /^input$/i.test(e.currentTarget.tagName) && e.which){
        submit = (e.which === 13) ? true : false;
      }
      
      if(submit){
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
              title: 'Sign Up Error',
              errors: errors
            },
            controller: ErrorDialog
          });
          
        }else{
          var $btn = $(e.currentTarget);
          $btn.prop('disabled', false);
          
          // Sign Up
          fb.createUser({
            email: $scope.email,
            password: $scope.password
          }, function(error, auth){
            if(error){
              $log.warn('Sign Up Failed', error);
              
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
              $log.info('Sign Up Success!', auth);
              
              // Log In
              fb.authWithPassword({
                'email': $scope.email,
                'password': $scope.password
              }, function(error, auth){
                $btn.prop('disabled', false);
        
                if(error){
                  $log.warn('Log In Failed', error);
                  
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
                  $scope.$apply(function() {
                    $location.path('/');
                  });
                }
              });
            }
          });
        }
      }
      
    };
  }
]);
