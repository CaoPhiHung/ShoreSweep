/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />
/// <reference path="IController.ts" />
/// <reference path="../services/AuthenticationService.ts" />
/// <reference path="../model/KioskLogModel.ts" />
var Clarity;
(function (Clarity) {
    var Controller;
    (function (Controller) {
        var helper = Clarity.Helper;
        //const variable
        var ALERT_PERIOD_TIME = 30 * 60 * 1000; // start alert every 30 minutes
        var ALERT_ANNIMATION_TIME = 10 * 1000; //show alert animation in 10s
        var REMINDER_COLOR = '#db1a35';
        var MainController = (function () {
            function MainController($scope, $rootScope, $http, $mdDialog, $timeout, $interval) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$mdDialog = $mdDialog;
                this.$timeout = $timeout;
                this.$interval = $interval;
                $scope.viewModel = this;
                this.kioskLogService = new Clarity.Service.KioskLogService($http);
                this.locationService = new Clarity.Service.LocationService($http);
                this.mainHelper = new helper.MainHelper();
                this.originalColor = $('.sv-header').css('backgroundColor');
                this.initPage();
                this.initReminder();
                this.getGPSLocation();
                $(window).bind("beforeunload", function (e) {
                    if ($('div.car-submit:not(.disabled)').length > 0) {
                        return "Are you sure you want to leave?";
                    }
                    e.preventDefault();
                });
            }
            MainController.prototype.initPage = function () {
                this.latitude = '';
                this.longitude = '';
                this.numberOfReceipts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                this.numberOfPaxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
                this.defaultColors = [
                    { code: '#FFFFFF', name: 'White' }, { code: '#a9a9a9', name: 'Grey' }, { code: '#000000', name: 'Black' },
                    { code: '#00008b', name: 'Blue' }, { code: '#c40401', name: 'Red' }, { code: '#8b4512', name: 'Brown' },
                    { code: '#2ecc71', name: 'Green' }, { code: '#ffe135', name: 'Yellow' }, { code: '#7b0099', name: 'Purple' },
                    { code: '#ff1493', name: 'Pink' }, { code: '#ff8C00', name: 'Orange' }];
                this.initLocation();
                this.initKioskLogs();
            };
            MainController.prototype.initReminder = function () {
                var _this = this;
                var reminderTime = this.getReminderTime(ALERT_PERIOD_TIME);
                this.$timeout(function () {
                    _this.startAlert();
                    _this.$interval(function () {
                        _this.startAlert();
                    }, ALERT_PERIOD_TIME);
                }, reminderTime);
            };
            MainController.prototype.startAlert = function () {
                var _this = this;
                var remindColor = REMINDER_COLOR;
                var p = $('.sv-header');
                this.animateBackGroundColor(p, this.originalColor, remindColor);
                this.$timeout(function () {
                    $(p).stop();
                    $(p).css('backgroundColor', _this.originalColor);
                }, ALERT_ANNIMATION_TIME);
            };
            MainController.prototype.animateBackGroundColor = function (element, oriColor, rmdColor) {
                var _this = this;
                $(element).animate({ backgroundColor: rmdColor }, 400, function () { return _this.animateBackGroundColor(element, rmdColor, oriColor); });
            };
            MainController.prototype.getReminderTime = function (periodTime) {
                var ret = null;
                if (this.$rootScope.user
                    && this.$rootScope.user.loginTime) {
                    var currDate = new Date();
                    var subTime = currDate.getTime() - new Date(this.$rootScope.user.loginTime).getTime();
                    if (periodTime >= subTime) {
                        ret = periodTime - subTime;
                    }
                    else {
                        ret = this.getReminderTime(periodTime + ALERT_PERIOD_TIME);
                    }
                    console.log('ret ' + ret);
                }
                return ret;
            };
            MainController.prototype.initKioskLogs = function () {
                this.kioskLogs = [];
                for (var i = 0; i < 6; i++) {
                    var kioskLog = new Clarity.Model.KioskLogModel();
                    kioskLog.queueType = 0;
                    kioskLog.gender = 0;
                    kioskLog.color = '#FFFFFF';
                    kioskLog.isAbandon = false;
                    this.kioskLogs.push(kioskLog);
                }
            };
            MainController.prototype.initLocation = function () {
                var _this = this;
                this.locationService.getAll(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == _this.$rootScope.user.locationId) {
                            _this.locationName = data[i].name;
                        }
                    }
                }, null);
            };
            MainController.prototype.submitKioskStartLog = function (kioskLog) {
                kioskLog.startTime = this.mainHelper.getCurrentDateTimeString();
            };
            MainController.prototype.submitKioskEnterLog = function (kioskLog) {
                kioskLog.enterTime = this.mainHelper.getCurrentDateTimeString();
            };
            MainController.prototype.submitKioskLeaveLog = function (kioskLog) {
                kioskLog.leaveTime = this.mainHelper.getCurrentDateTimeString();
            };
            MainController.prototype.isKioskStartStarted = function (kioskLog) {
                if (kioskLog.startTime != null && kioskLog.startTime != '') {
                    return true;
                }
                return false;
            };
            MainController.prototype.isKioskEnterStarted = function (kioskLog) {
                if (kioskLog.enterTime != null && kioskLog.enterTime != '') {
                    return true;
                }
                return false;
            };
            MainController.prototype.isKioskLeaveStarted = function (kioskLog) {
                if (kioskLog.leaveTime != null && kioskLog.leaveTime != '') {
                    return true;
                }
                return false;
            };
            MainController.prototype.submitKioskLog = function (kioskLog, index) {
                var _this = this;
                kioskLog.finishedTime = this.mainHelper.getCurrentDateTimeString();
                if (this.$rootScope.user) {
                    kioskLog.terminalId = this.$rootScope.user.terminalId;
                    kioskLog.locationId = this.$rootScope.user.locationId;
                    kioskLog.interviewerId = this.$rootScope.user.username;
                    kioskLog.numberOfCounter = this.$rootScope.user.numberOfCounter;
                    kioskLog.shift = this.$rootScope.user.shift;
                }
                kioskLog.latitude = this.latitude;
                kioskLog.longitude = this.longitude;
                kioskLog.geoRequestedTime = this.geoRequestedTime;
                this.kioskLogService.create(kioskLog, function (data) {
                    _this.deleteKioskLog(index);
                }, function (data) { });
                this.getGPSLocation();
            };
            MainController.prototype.deleteKioskLog = function (index) {
                this.kioskLogs.splice(index, 1);
                this.createKioskLog();
            };
            MainController.prototype.deleteKioskLogConfirm = function (index, event) {
                var confirm = this.$mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('Would you like to delete your kiosk log?')
                    .targetEvent(event)
                    .ok('OK')
                    .cancel('Cancel');
                var self = this;
                this.$mdDialog.show(confirm).then(function () {
                    self.deleteKioskLog(index);
                }, function () { });
            };
            MainController.prototype.showColorDialog = function (kioskLog, event) {
                var self = this;
                this.$mdDialog.show({
                    controller: function ($scope, $mdDialog, kioskLog) {
                        $scope.defaultColors = self.$scope.viewModel.defaultColors;
                        $scope.hide = function () {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.selectColor = function (color) {
                            kioskLog.color = color;
                            $mdDialog.hide();
                        };
                    },
                    templateUrl: '/html/color-dialog.html' + '?v=' + VERSION_NUMBER,
                    targetEvent: event,
                    clickOutsideToClose: true,
                    locals: {
                        kioskLog: kioskLog
                    }
                })
                    .then(function (answer) { }, function () { });
            };
            MainController.prototype.DialogController = function ($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.answer = function (answer) {
                    $mdDialog.hide(answer);
                };
            };
            MainController.prototype.createKioskLog = function () {
                if (this.kioskLogs == null) {
                    this.kioskLogs = [];
                }
                var newKioskLog = new Clarity.Model.KioskLogModel();
                newKioskLog.queueType = 0;
                newKioskLog.gender = 0;
                newKioskLog.isAbandon = false;
                newKioskLog.color = '#ffffff';
                this.kioskLogs.push(newKioskLog);
            };
            MainController.prototype.onGetLocationSuccess = function (position) {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.geoRequestedTime = this.mainHelper.getCurrentDateTimeString();
            };
            MainController.prototype.onGetLocationFail = function (data) {
                this.latitude = '';
                this.longitude = '';
                this.geoRequestedTime = this.mainHelper.getCurrentDateTimeString();
            };
            MainController.prototype.getGPSLocation = function () {
                var _this = this;
                navigator.geolocation.getCurrentPosition(function (data) { _this.onGetLocationSuccess(data); }, function (data) { _this.onGetLocationFail(data); });
            };
            MainController.prototype.enableSubmitKioskLog = function (kioskLog) {
                if (kioskLog.isAbandon) {
                    if (kioskLog.abandonReason == null || kioskLog.abandonReason == '') {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                if (kioskLog.startTime == null || kioskLog.startTime == '') {
                    return false;
                }
                if (kioskLog.enterTime == null || kioskLog.enterTime == '') {
                    return false;
                }
                if (kioskLog.leaveTime == null || kioskLog.leaveTime == '') {
                    return false;
                }
                if (kioskLog.numberOfReceipt == null) {
                    return false;
                }
                if (kioskLog.numberOfPax == null) {
                    return false;
                }
                if (kioskLog.queueType == null) {
                    return false;
                }
                if (kioskLog.gender == null) {
                    return false;
                }
                if (kioskLog.color == null || kioskLog.color == '') {
                    return false;
                }
                return true;
            };
            MainController.prototype.onIsAbandonChange = function (kioskLog) {
                if (!kioskLog.isAbandon) {
                    kioskLog.abandonReason = '';
                }
            };
            MainController.prototype.isKioskSubmitted = function (kioskLog) {
                if (kioskLog.finishedTime != null && kioskLog.finishedTime != '') {
                    return true;
                }
                return false;
            };
            return MainController;
        }());
        Controller.MainController = MainController;
    })(Controller = Clarity.Controller || (Clarity.Controller = {}));
})(Clarity || (Clarity = {}));
