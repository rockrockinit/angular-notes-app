/**
 * Sign Up Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-15
 */
ctrls.controller('SignupCtrl', [
  '$scope',
  '$location',
  'fb',
  function($scope, $location, fb){
    console.log('SignupCtrl');

    $('.signup .btn-primary').on('click', function(e){
      var $btn = $(this),
        $login = $btn.closest('.form'),
        form = $login.serializeElement();

      $btn.prop('disabled', true);

      // Sign Up
      fb.createUser({
        email: form.email,
        password: form.password
      }, function(error, auth){
        if(error){
          console.log('Sign Up Failed!', error);
          alert('Sign Up Failed!');
        }else{
          console.log('Sign Up Success!', auth);
          
          // Log In
          fb.authWithPassword({
            'email': form.email,
            'password': form.password
          }, function(error, auth){
            $btn.prop('disabled', false);
    
            if(error){
              console.log('Log In Failed!', error);
              alert('Log In Failed!');
            }else{
              console.log('Log In Success!', auth);
              $scope.$apply(function() {
                $location.path('/');
              });
            }
          });
        }
      });
    });
  }
]);