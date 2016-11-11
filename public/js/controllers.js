angular.module('app.controllers', [])
  
.controller('homeTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('findTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('mineTabDefaultPageCtrl', ['$scope', '$stateParams','$http','$state','$rootScope',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope) {
    if(!$rootScope.isLogin)
        $scope.user={phonenumber:'点击登录/注册'};
    else
        $scope.user={phonenumber:$stateParams.phonenumber};

    $scope.infoClick= function(){
        if(!$rootScope.isLogin)
            $state.go('loginPage');
        else{
            $state.go('userInfoPage',{phonenumber : $stateParams.phonenumber});
        }
    }




}])
      
.controller('loginPageCtrl', ['$scope', '$stateParams','$http','$state','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope) {
    $scope.user = {phonenumber:$stateParams.phonenumber};
    $scope.login= function(){
        $http.post('/users/login',$scope.user)
            .success(function (data, status, headers, config) {
                console.log(data);
                $rootScope.isLogin=true;
                $state.go('tabsController.mineTabDefaultPage',{phonenumber : data.phonenumber});
            });
    }
}])
   
.controller('signupPageCtrl', ['$scope', '$stateParams', '$http','$state','$ionicPopup','$ionicHistory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$ionicPopup,$ionicHistory) {
   $scope.signup= function(){
       $http.post('/users/signup',$scope.user)
           .success(function (data, status, headers, config) {
               console.log(data);
               $ionicPopup.alert({
                   title: '注册成功！', // String. 弹窗的标题。
                   subTitle: '请登录！', // String (可选)。弹窗的子标题。
                   template: '', // String (可选)。放在弹窗body内的html模板。
                   templateUrl: '', // String (可选)。 放在弹窗body内的html模板的URL。
                   okText: '确定', // String (默认: 'OK')。OK按钮的文字。
                   okType: '', // String (默认: 'button-positive')。OK按钮的类型。
               });
               $state.go('loginPage',{phonenumber : data.phonenumber});
           });
   }
}])



.controller('userInfoPageCtrl', ['$scope', '$stateParams', '$http','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state) {
    $scope.user = {phonenumber:$stateParams.phonenumber};
    console.log($scope.user);
    $http.get('/users/get-user-info',{params: $scope.user} )
        .success(function (data, status, headers, config) {
            console.log(data);
            $scope.user=data;
        });


}])

.controller('editUserInfoPageCtrl', ['$scope', '$stateParams', '$http','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state) {
    $scope.user = {phonenumber:$stateParams.phonenumber};

    $http.get('/users/get-user-info',{params: $scope.user} )
        .success(function (data, status, headers, config) {
            console.log(data);
            $scope.user=data;
        });

    $scope.saveUserInfo= function(){
        $http.post('/users/save-user-info',$scope.user)
            .success(function (data, status, headers, config) {
                console.log(data);
                $state.go('tabsController.mineTabDefaultPage',{phonenumber : data.phonenumber});
            });
    }

}])