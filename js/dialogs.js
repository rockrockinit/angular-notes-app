function ErrorDialog($scope, $mdDialog, title, errors){
  $scope.title = title;
  $scope.errors = errors;
  
  $scope.closeDialog = function(){
    $mdDialog.hide();
  }
}

function LoadingDialog($scope, $mdDialog, title){
  $scope.title = title;
  
  $scope.closeDialog = function(){
    $mdDialog.hide();
  }
}