﻿
angular.element(document).ready(function () {
  angular.bootstrap(document.documentElement, ['clarityApp']);
});

// using this to improve performance if angularJS 1.2
if (jQuery) {
  var originalFn = $.fn.data;
  $.fn.data = function () {
    if (arguments[0] !== '$binding')
      return originalFn.apply(this, arguments);
  }
}

var clarityApp = angular.module('clarityApp', ['ngMaterial', 'ngAnimate', 'ngCookies', 'ngRoute', 'ui.bootstrap', 'ui.select2', 'ui.sortable', 'google-map'], function ($routeProvider, $httpProvider) {

  // --- Routes ---

  $routeProvider
    .when('/', {
        templateUrl: '/html/index.html' + '?v=' + VERSION_NUMBER,
      controller: 'MainController',
      access: 'authorized'
    })
    .when('/login', {
      templateUrl: '/html/login.html' + '?v=' + VERSION_NUMBER,
      controller: 'LoginController',
      access: 'public'
    })
    .when('/not_found', {
      templateUrl: '/html/not-found.html' + '?v=' + VERSION_NUMBER,
      controller: '',
      access: 'public'
    })
    .when('/error', {
      templateUrl: '/html/error.html' + '?v=' + VERSION_NUMBER,
      controller: '',
      access: 'public'
    })
    .when('/access_denied', {
      templateUrl: '/html/access-denied.html' + '?v=' + VERSION_NUMBER,
      controller: '',
      access: 'public'
    })
    .when('/not_authorized', {
      templateUrl: '/html/not-authorized.html' + '?v=' + VERSION_NUMBER,
      controller: '',
      access: 'share'
    })
    .otherwise({ redirectTo: '/' });
});


clarityApp.config(function ($controllerProvider, $provide, $compileProvider, $httpProvider) {
  clarityApp._controller = clarityApp.controller;

  clarityApp.controller = function (name, constructor) {
    $controllerProvider.register(name, constructor);
    return (this);
  };

  $httpProvider.interceptors.push('requestInterceptor');
}).factory('requestInterceptor', function ($q, $rootScope, $location) {
  $rootScope.pendingRequests = 0;

  return {
    'request': function (config) {
      $rootScope.disableElements();
      $rootScope.pendingRequests++;

      return config || $q.when(config);
    },

    'requestError': function (rejection) {
      $rootScope.pendingRequests--;
      $rootScope.enableElements();

      return $q.reject(rejection);
    },

    'response': function (response) {
      $rootScope.error = '';
      $rootScope.pendingRequests--;
      $rootScope.enableElements();

      return response || $q.when(response);
    },

    'responseError': function (rejection) {
      if (rejection.status === 401 || rejection.status === 403) {
        $rootScope.returnUrl = $location.path();
        $location.path('/login');
      }
      else if (rejection.status === 404) {
        if (rejection.config.url.indexOf('/api/') == 0) {
          $rootScope.error = 'not_found';
        }
      }
      else if (rejection.status === 500) {
        $rootScope.error = 'server_error';
      }

      return $q.reject(rejection);
    }
  }
});

clarityApp.service('baseService', Clarity.Service.BaseService);
clarityApp.service('authenticationService', Clarity.Service.AuthenticationService);
clarityApp.service('carLogService', Clarity.Service.CarLogService);
clarityApp.service('staffLogService', Clarity.Service.StaffLogService);
clarityApp.service('terminalService', Clarity.Service.TerminalService);
clarityApp.service('locationService', Clarity.Service.LocationService);
clarityApp.service('userService', Clarity.Service.UserService);
clarityApp.service('userLogService', Clarity.Service.UserLogService);
clarityApp.service('trashService', Clarity.Service.TrashService);

clarityApp.controller('LoginController', Clarity.Controller.LoginController);
clarityApp.controller('LogoutController', Clarity.Controller.LogoutController);
clarityApp.controller('MainController', Clarity.Controller.MainController);

clarityApp.run(function ($rootScope, $routeParams, $location, authenticationService, $http, $cookieStore, $window) {

  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    $rootScope.error = null;

    if (next.access != 'public' && next.access != 'share' && !authenticationService.isAuthenticated()) {
        $rootScope.returnUrl = $location.path();
        $location.path('/login');
    }
    else {
        $rootScope.user = $cookieStore.get('user');
    }
  });

  $rootScope.onError = function (error) {
    if (error == null || error == '') {
      if ($rootScope.error === 'not_found') {
        $location.path('/not_found');
      } else if ($rootScope.error === 'server_error') {
      }
    }

    $rootScope.error = error;

    if ($location.path() == "/login" || $location.path() == "/not_found") {
      var e = jQuery.Event("keydown");
      e.which = 27;
      $("input").trigger(e);
    }

    $rootScope.hideSpinner();
  };

  $rootScope.getError = function () {
    return $rootScope.error;
  };

  $rootScope.showSpinner = function () {
    $("#bg-preload").show();
  };

  $rootScope.hideSpinner = function () {
    $("#bg-preload").hide();
  };

  $rootScope.clearCache = function ($window) {
    $rootScope.user = null;
  }

  $rootScope.enableElements = function() {
    if ($rootScope.pendingRequests < 1) {
      $('.wait-data-loading').removeAttr('disabled');
    }
  }

  $rootScope.disableElements = function() {
    $('.wait-data-loading').attr('disabled', 'disabled');
  }
});