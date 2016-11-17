angular.module('app.controllers', [])
  
.controller('homeTabDefaultPageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    $scope.color= 'red';
    $scope.cards=[
        {name:'wuke' , editDate:'2016/11/16', title:'寻找另一个地方',likeNum: 5, commentNum:8 },
        {name:'dory' , editDate:'2016/05/16', title:'发现新大陆',likeNum: 1, commentNum:0 }
    ]


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
    if(!$rootScope.isLogin)//判断是否登录
        $scope.user={phonenumber:'点击登录/注册'};
    else
        $scope.user={phonenumber:localStorage.getItem("phonenumber")};

    $scope.infoClick= function(){
        $state.go('userInfoPage',{phonenumber : localStorage.getItem("phonenumber")});//跳转个人信息页面
    }

    $scope.signout= function(){
        localStorage.removeItem("phonenumber");
        $rootScope.isLogin=false;
        $state.go('tabsController.homeTabDefaultPage');
    }

}])
      
.controller('loginPageCtrl', ['$scope', '$stateParams','$http','$state','$rootScope',"$ionicPopup","$timeout", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope,$ionicPopup,$timeout) {
    $scope.login= function(){
        $http.post($rootScope.urlAddress+'/users/login',$scope.user)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data.isLoginSuccess==true){
                    $rootScope.isLogin=true;
                    localStorage.setItem("phonenumber", $scope.user.phonenumber);
                    var loginPopup = $ionicPopup.show({
                        title: '登录成功'
                    });
                    $timeout(function() {
                        loginPopup.close(); //由于某种原因2秒后关闭弹出
                    }, 1000);
                    $state.go('tabsController.mineTabDefaultPage');
                }else {
                    $rootScope.isLogin=false;
                    $scope.isLoginFailure=true;
                }
            });
    }
}])
   
.controller('signupPageCtrl', ['$scope', '$stateParams', '$http','$state','$ionicPopup','$ionicHistory','$timeout','$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$ionicPopup,$ionicHistory,$timeout,$rootScope) {
   $scope.signup= function(){
       $http.post($rootScope.urlAddress+'/users/signup',$scope.user)
           .success(function (data, status, headers, config) {
               console.log(data);
               var sigupPopup = $ionicPopup.show({
                   title: '注册成功',
                   subTitle: '请登录'
               });
               $timeout(function() {
                   sigupPopup.close(); //由于某种原因2秒后关闭弹出
               }, 1000);
               $state.go('loginPage');
           });
   }
}])



.controller('userInfoPageCtrl', ['$scope', '$stateParams', '$http','$state','$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope) {
    $scope.user = {phonenumber:$stateParams.phonenumber};

    $http.get($rootScope.urlAddress+'/users/get-user-info',{params: $scope.user} )
        .success(function (data, status, headers, config) {
            console.log(data);
            $scope.user=data;
        });

    $scope.saveUserInfo= function(){
        $http.post($rootScope.urlAddress+'/users/save-user-info',$scope.user)
            .success(function (data, status, headers, config) {
                console.log(data);
                $state.go('tabsController.mineTabDefaultPage');
            });
    }

}])


.controller('verifyMailboxPageCtrl', ['$scope', '$stateParams','$interval','$http', '$ionicPopup', '$timeout','$state','$rootScope',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$interval,$http,$ionicPopup,$timeout,$state,$rootScope) {
    $scope.isSendCode=false;
    $scope.sendCodeBtnText='发送验证码';
    $scope.sendCode= function() {
        var second=60;
        var user = {
            phonenumber:localStorage.getItem("phonenumber"),
            email:$scope.email
        };

        $http.post($rootScope.urlAddress+'/users/send-verify-mail',user)
            .success(function (data, status, headers, config) {
                if(data=='success') {
                    var timer = $interval(function () {
                        if (second <= 0) {
                            $interval.cancel(timer);
                            second = 60;
                            $scope.sendCodeBtnText = "重发验证码";
                            $scope.isSendCode = false;
                        } else {
                            $scope.sendCodeBtnText = second + "秒后可重发";
                            $scope.isSendCode = true;
                            second--;
                        }
                    }, 1000, 100);
                }else if(data=='exist'){
                    var sendCodePopup = $ionicPopup.show({
                        title: '邮箱已被验证'
                    });
                    $timeout(function() {
                        sendCodePopup.close(); //1秒后关闭弹出
                    }, 1000);
                }
            });

    }

    $scope.verifyMailbox= function() {
        var user = {
            phonenumber:localStorage.getItem("phonenumber"),
            email:$scope.email,
            emailCode:$scope.emailCode
        };
        $http.post($rootScope.urlAddress+'/users/verify-mailbox',user)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data=='success'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '验证成功'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close(); //1秒后关闭弹出
                    }, 1000);
                    $state.go('tabsController.mineTabDefaultPage');
                }else if(data=='timeout'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '验证码失效'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close();
                    }, 1000);
                }else if(data=='incorrect'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '验证码不正确'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close();
                    }, 1000);
                }else if(data=='mismatch'){
                    var verifyMailboxPopup = $ionicPopup.show({
                        title: '当前输入邮箱与验证邮箱不匹配'
                    });
                    $timeout(function() {
                        verifyMailboxPopup.close();
                    }, 1000);
                }

            });
    }
}])


.controller('editCardPageCtrl', ['$scope', '$stateParams','$http','$ionicPopup','$timeout','$state','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $timeout, $state,$rootScope) {

    $scope.publish= function() {
        var card ={
            phonenumber:localStorage.getItem("phonenumber"),
            name:'wuke',
            likeNum:0,
            commentNum:0,
            hidden:false,
            title:$scope.title,
            body:$scope.body
        };

        $http.post($rootScope.urlAddress+'/cards/publish',card)
            .success(function (data, status, headers, config) {
                console.log(data);
                if(data=='success'){
                    var publishPopup = $ionicPopup.show({
                        title: '发布成功'
                    });
                    $timeout(function() {
                        publishPopup.close(); //1秒后关闭弹出
                    }, 1000);
                    $state.go('tabsController.homeTabDefaultPage');
                }
            });

    }

}])

.controller('viewCardPageCtrl', ['$scope', '$stateParams','$http','$ionicPopup','$timeout','$state','$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopup, $timeout, $state,$rootScope) {



}])