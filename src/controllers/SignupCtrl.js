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
    
    // Auto Login Redirect
    if($app.getAuth()){
      $location.path('/');
    }
    
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
        
        if(!$scope.first_name){
          errors.push('First Name is required');
        }
        
        if(!$scope.last_name){
          errors.push('Last Name is required');
        }
        
        if(!$scope.email){
          errors.push('Email is required');
        }
        
        if(!$scope.password){
          errors.push('Password is required');
        }else if($scope.password.length < 8){
          errors.push('Passwords are required a minimum of 8 characters');
        }
        
        if(errors.length){
          
          $mdDialog.show({
            templateUrl: 'views/dialogs/errors.html',
            locals: {
              title: 'Sign Up Error',
              errors: errors
            },
            parent: 'body',
            controller: ErrorDialog
          });
          
        }else{
          
          var $btn = $(e.currentTarget);
          $btn.prop('disabled', false);
          
          $mdDialog.show({
            templateUrl: 'views/dialogs/loading.html',
            locals: {
              title: 'Signing Up...'
            },
            parent: 'body',
            controller: LoadingDialog,
            onComplete: function(){
              
              // Sign Up
              fb.createUser({
                email: $scope.email,
                password: $scope.password
              }, function(error, auth){
                if(error){
                  $log.warn('Sign Up Failed', error);
                  $btn.prop('disabled', false);
                  
                  var errors = [];
                  errors.push(error.toString().replace(/^Error:/, '').trim());
                  
                  $mdDialog.show({
                    templateUrl: 'views/dialogs/errors.html',
                    locals: {
                      title: 'Sign Up Failed',
                      errors: errors
                    },
                    parent: 'body',
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
                        templateUrl: 'views/dialogs/errors.html',
                        locals: {
                          title: 'Log In Failed',
                          errors: errors
                        },
                        parent: 'body',
                        controller: ErrorDialog
                      });
                    }
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
