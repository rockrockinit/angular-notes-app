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
  '$log',
  'AppService',
  'fb',
  function($scope, $location, $mdDialog, $log, $app, fb){
    $log.info('LoginCtrl');
    
    $app.setTitle('Log in to Notes');
    
    $scope.email = '';
    $scope.password = '';
    
    $scope.login = function(e){
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
            templateUrl: 'views/dialogs/errors.html',
            locals: {
              title: 'Log In Error',
              errors: errors
            },
            controller: ErrorDialog
          });
        }else{
          
          var $btn = $(e.currentTarget);
          $btn.prop('disabled', false);
          
          $mdDialog.show({
            templateUrl: 'views/dialogs/loading.html',
            locals: {
              title: 'Logging In...'
            },
            controller: LoadingDialog,
            onComplete: function(){
              
              // Log In
              fb.authWithPassword({
                'email': $scope.email,
                'password': $scope.password
              }, function(error, auth){
                
                $btn.prop('disabled', false);
                
                if(error){
                  $log.warn('Log In Failed!', error);
                  
                  var errors = [];
                  errors.push(error.toString().replace(/^Error:/, '').trim());
                  
                  $mdDialog.show({
                    templateUrl: 'views/dialogs/errors.html',
                    locals: {
                      title: 'Log In Failed',
                      errors: errors
                    },
                    controller: ErrorDialog
                  });
                }else{
                  $mdDialog.hide();
                  
                  $scope.$apply(function(){
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