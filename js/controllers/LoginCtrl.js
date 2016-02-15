/**
 * Log In Controller
 *
 * @author Ed Rodriguez <ed@edrodriguez.com>
 * @created 2016-02-14
 */
ctrls.controller('LoginCtrl', [
  '$scope',
  '$location',
  'fb',
  function($scope, $location, fb){
    console.log('LoginCtrl');

    $('.login .btn-primary').on('click', function(e){
      var $btn = $(this),
        $login = $btn.closest('.form'),
        form = $login.serializeElement();

      $btn.prop('disabled', true);

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
    });
  }
]);