/// <reference path="../../services/AuthenticationService.ts" />
/// <reference path="../IController.ts" />
/// <reference path="../../../lib/angular/angular.d.ts" />
var Clarity;
(function (Clarity) {
    var Controller;
    (function (Controller) {
        var service = Clarity.Service;
        var LogoutController = (function () {
            function LogoutController($scope, $location, $window, $rootScope, $http, $cookieStore) {
                this.$scope = $scope;
                this.$location = $location;
                this.$window = $window;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$cookieStore = $cookieStore;
                $scope.viewModel = this;
                this.authenticationService = new service.AuthenticationService($http, $cookieStore);
                this.userLogService = new service.UserLogService($http);
                this.mainHelper = new Clarity.Helper.MainHelper();
            }
            LogoutController.prototype.submit = function () {
                var _this = this;
                this.$rootScope.showSpinner();
                this.authenticationService.logout(function () { _this.onSubmitSuccess(); }, function () { _this.$rootScope.onError(); });
            };
            LogoutController.prototype.onSubmitSuccess = function () {
                this.updateUserLog(this.$rootScope.user);
                this.$rootScope.clearCache();
                this.$rootScope.hideSpinner();
                this.$location.path('/login');
            };
            LogoutController.prototype.updateUserLog = function (user) {
                var _this = this;
                this.userLogService.getById(user.userLogId, function (userLog) {
                    _this.$window.navigator.geolocation.getCurrentPosition(function (position) {
                        userLog.logoutTime = _this.mainHelper.getCurrentDateTimeString();
                        userLog.logoutLatitude = position.coords.latitude;
                        userLog.logoutLongitude = position.coords.longitude;
                        _this.userLogService.createOrUpdate(userLog, function (data) { }, function (data) { });
                    }, function (data) {
                        userLog.logoutTime = _this.mainHelper.getCurrentDateTimeString();
                        userLog.logoutLatitude = '';
                        userLog.logoutLongitude = '';
                        _this.userLogService.createOrUpdate(userLog, function (data) { }, function (data) { });
                    });
                }, function (data) { });
            };
            return LogoutController;
        }());
        Controller.LogoutController = LogoutController;
    })(Controller = Clarity.Controller || (Clarity.Controller = {}));
})(Clarity || (Clarity = {}));
