angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('tabsController.homeTabDefaultPage', {
    url: '/home-tab-default-page',
    views: {
      'tab1': {
        templateUrl: 'templates/homeTabDefaultPage.html',
        controller: 'homeTabDefaultPageCtrl'
      }
    }
  })

  .state('tabsController.findTabDefaultPage', {
    url: '/find-tab-default-page',
    views: {
      'tab2': {
        templateUrl: 'templates/findTabDefaultPage.html',
        controller: 'findTabDefaultPageCtrl'
      }
    }
  })

  .state('tabsController.mineTabDefaultPage', {
    url: '/mine-tab-default-page',
    views: {
      'tab3': {
        templateUrl: 'templates/mineTabDefaultPage.html',
        controller: 'mineTabDefaultPageCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/tabs-controller',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('loginPage', {
    url: '/login-page',
    templateUrl: 'templates/loginPage.html',
    controller: 'loginPageCtrl'
  })

  .state('signupPage', {
    url: '/signup-page',
    templateUrl: 'templates/signupPage.html',
    controller: 'signupPageCtrl'
  })

  .state('userInfoPage', {
    cache: false,
    url: '/user-info-page/:phonenumber/',
    templateUrl: 'templates/userInfoPage.html',
    controller: 'userInfoPageCtrl'
  })

  .state('editUserInfoPage', {
    url: '/edit-user-info-page/:phonenumber/',
    templateUrl: 'templates/editUserInfoPage.html',
    controller: 'editUserInfoPageCtrl'
  })

  $urlRouterProvider.otherwise('/tabs-controller/home-tab-default-page')

  

});