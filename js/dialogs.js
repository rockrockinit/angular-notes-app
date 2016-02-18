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

function ConfirmDialog($scope, $mdDialog, $sce, params){
  $scope.title = params.title || 'Confirm';
  $scope.message = $sce.trustAsHtml(params.message || '');
  
  $scope.ok = function(){
    if(typeof params.onOk === 'function'){
      params.onOk.call($scope, params);
    }
    $mdDialog.hide();
  }
  
  $scope.cancel = function(){
    if(typeof params.onCancel === 'function'){
      params.onCancel.call($scope, params);
    }
    $mdDialog.hide();
  }
}