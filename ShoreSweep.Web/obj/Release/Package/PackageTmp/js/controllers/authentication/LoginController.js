/// <reference path="../../services/AuthenticationService.ts" />
/// <reference path="../../model/UserModel.ts" />
/// <reference path="../IController.ts" />
/// <reference path="../../../lib/angular/angular.d.ts" />
/// <reference path="../../../lib/angular/angular-cookies.d.ts" />
var Clarity;
(function (Clarity) {
    var Controller;
    (function (Controller) {
        var service = Clarity.Service;
        var helper = Clarity.Helper;
        var LoginController = (function () {
            function LoginController($scope, $location, $window, $rootScope, $http, $cookieStore) {
                this.$scope = $scope;
                this.$location = $location;
                this.$window = $window;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$cookieStore = $cookieStore;
                $scope.viewModel = this;
                this.authenticationService = new service.AuthenticationService($http, $cookieStore);
                this.terminalService = new service.TerminalService($http);
                this.locationService = new service.LocationService($http);
                this.userService = new service.UserService($http);
                this.userLogService = new service.UserLogService($http);
                this.mainHelper = new helper.MainHelper();
                this.errorMessage = '';
                this.cookieStore = $cookieStore;
                this.initPage();
            }
            LoginController.prototype.initPage = function () {
                var _this = this;
                this.userService.getAll(function (data) { _this.onGetUserSuccess(data); }, function (data, status) { _this.onGetUserError(data, status); });
                this.terminalService.getAll(function (data) { _this.onGetTerminalSuccess(data); }, function (data, status) { _this.onGetTerminalError(data, status); });
                this.locationService.getAll(function (data) { _this.onGetLocationSuccess(data); }, function (data, status) { _this.onGetLocationError(data, status); });
                this.numberOfCounterList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                this.shiftList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            };
            LoginController.prototype.submit = function () {
                var _this = this;
                this.$rootScope.showSpinner();
                this.$window.navigator.geolocation.getCurrentPosition(function (position) {
                    _this.longitude = position.coords.longitude.toString();
                    _this.latitude = position.coords.latitude.toString();
                    _this.user.loginTime = new Date().toString();
                    _this.authenticationService.login(_this.user, function (data) { _this.onSubmitSuccess(data); }, function (data, status) { _this.onSubmitError(data, status); });
                }, function (data) {
                    _this.onGetGPSLocationError();
                });
            };
            LoginController.prototype.onGetTerminalSuccess = function (terminals) {
                this.terminalList = terminals;
            };
            LoginController.prototype.onGetTerminalError = function (data, status) {
            };
            LoginController.prototype.onGetLocationSuccess = function (locations) {
                this.locationList = locations;
            };
            LoginController.prototype.onGetLocationError = function (data, status) {
            };
            LoginController.prototype.onGetUserSuccess = function (users) {
                this.userList = users;
            };
            LoginController.prototype.onGetUserError = function (data, status) {
            };
            LoginController.prototype.onSubmitSuccess = function (user) {
                this.$rootScope.clearCache();
                this.$rootScope.user = user;
                this.createUserLog(user);
                if (this.$rootScope.returnUrl && this.$rootScope.returnUrl != '/login') {
                    this.$location.path(this.$rootScope.returnUrl);
                }
                else {
                    this.$location.path('/');
                }
                this.$rootScope.hideSpinner();
            };
            LoginController.prototype.onSubmitError = function (data, status) {
                switch (status) {
                    case 404:
                        this.errorMessage = 'User does not exist';
                        break;
                    case 409:
                        this.errorMessage = 'Wrong password';
                        break;
                    case 410:
                        this.errorMessage = 'User is disabled';
                        break;
                }
                this.$rootScope.hideSpinner();
            };
            LoginController.prototype.onGetGPSLocationError = function () {
                this.errorMessage = 'You must allow GPS location';
                this.$rootScope.hideSpinner();
                this.$scope.$apply();
            };
            LoginController.prototype.createUserLog = function (user) {
                var _this = this;
                var userLog = new Clarity.Model.UserLogModel();
                userLog.interviewerId = user.username;
                userLog.terminalId = user.terminalId;
                userLog.locationId = user.locationId;
                userLog.numberOfCounter = user.numberOfCounter;
                userLog.shift = user.shift;
                userLog.loginTime = this.mainHelper.formatDateTimeToString(user.loginTime);
                userLog.loginLatitude = this.latitude;
                userLog.loginLongitude = this.longitude;
                this.userLogService.create(userLog, function (data) {
                    _this.$rootScope.user.userLogId = data.id;
                    _this.cookieStore.remove('user');
                    _this.cookieStore.put('user', _this.$rootScope.user);
                }, function (data) { });
            };
            return LoginController;
        }());
        Controller.LoginController = LoginController;
    })(Controller = Clarity.Controller || (Clarity.Controller = {}));
})(Clarity || (Clarity = {}));
