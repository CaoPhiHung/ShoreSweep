/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />
/// <reference path="IController.ts" />
/// <reference path="../services/AuthenticationService.ts" />
var Clarity;
(function (Clarity) {
    var Controller;
    (function (Controller) {
        var helper = Clarity.Helper;
        var MainController = (function () {
            function MainController($scope, $rootScope, $http, $mdDialog) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$mdDialog = $mdDialog;
                $scope.viewModel = this;
                this.trashService = new Clarity.Service.TrashService($http);
                this.mainHelper = new helper.MainHelper();
                this.initTrashInformationList();
            }
            MainController.prototype.initTrashInformationList = function () {
                var _this = this;
                this.trashService.getAll(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        _this.initFirstImage(data[i]);
                    }
                    _this.trashInformationList = data;
                    _this.showSpinner = false;
                }, function (data) { });
            };
            MainController.prototype.showGoogleMapDialog = function (trashInfo, event) {
                var self = this;
                console.log(trashInfo.images);
                this.$mdDialog.show({
                    controller: function ($scope, $mdDialog, trashInfo) {
                        $scope.trashInfo = trashInfo;
                        $scope.hide = function () {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.selectColor = function (color) {
                            console.log(trashInfo);
                            $mdDialog.hide();
                        };
                    },
                    templateUrl: '/html/google-map-dialog.html' + '?v=' + VERSION_NUMBER,
                    targetEvent: event,
                    clickOutsideToClose: true,
                    locals: {
                        trashInfo: trashInfo
                    }
                })
                    .then(function (answer) { }, function () { });
            };
            MainController.prototype.uploadFile = function (element) {
                this.errorMessage = '';
                var self = this;
                this.$scope.$apply(function () {
                    if (element != null
                        && element.files.length > 0
                        && element.files[0] != null
                        && self.isValidFileType(element.files[0].name)
                        && self.checkFileSize(element.files[0].size)) {
                        var fd = new FormData();
                        fd.append('file', element.files[0]);
                        self.excelFileUpload = fd;
                        var reader = new FileReader();
                        reader.onload = function () {
                            self.$scope.$apply();
                        };
                        reader.readAsDataURL(element.files[0]);
                    }
                });
            };
            MainController.prototype.importCSVFile = function () {
                var _this = this;
                this.isImportLoading = true;
                //this.trashService.importCSV(this.excelFileUpload,
                //    (data) => {
                //        //this.onImportUserSuccess(data);
                //    },
                //    (data) => {
                //        //this.onImportUserError(data);
                //    });
                this.trashService.importTrashRecord(this.importTrashList, function (data) {
                    _this.onImportTrashListSuccess(data);
                }, function (data) {
                    //this.onImportUserError(data);
                });
            };
            MainController.prototype.onImportTrashListSuccess = function (data) {
                for (var i = 0; i < data.length; i++) {
                    this.initFirstImage(data[i]);
                    this.trashInformationList.push(data[i]);
                }
                alert('Imported ' + data.length + ' records');
            };
            MainController.prototype.initFirstImage = function (trash) {
                trash.firstImage = trash.images.split(',')[0];
            };
            MainController.prototype.isValidFileType = function (fileName) {
                if (fileName != null) {
                    var fileNameParts = fileName.split('.');
                    if (fileNameParts.length > 1) {
                        var fileNameExtension = fileNameParts[fileNameParts.length - 1];
                        if (fileNameExtension.toLowerCase() === 'csv') {
                            return true;
                        }
                    }
                }
                this.errorMessage = 'File format is not supported. Please upload a csv file.';
                return false;
            };
            MainController.prototype.checkFileSize = function (size) {
                if (size > 20971520) {
                    this.errorMessage = 'File size exceeds 20MB limit.';
                    return false;
                }
                return true;
            };
            MainController.prototype.openFile = function (event) {
                var input = event.target;
                var self = this;
                var reader = new FileReader();
                this.importTrashList = [];
                reader.onload = function () {
                    var records = reader.result.split('\n');
                    for (var line = 1; line < records.length; line++) {
                        var record = records[line].split(';');
                        var trash = new Clarity.Model.TrashInformationModel();
                        trash.trashId = record[0];
                        trash.latitude = record[1];
                        trash.longitude = record[2];
                        trash.continent = record[3];
                        trash.country = record[4];
                        trash.administrativeArea1 = record[5];
                        trash.administrativeArea2 = record[6];
                        trash.administrativeArea3 = record[7];
                        trash.locality = record[8];
                        trash.subLocality = record[9];
                        trash.description = record[10];
                        trash.status = record[11];
                        trash.url = record[12];
                        trash.images = record[13];
                        trash.type = record[14];
                        self.importTrashList.push(trash);
                    }
                    //var map = new google.maps.Map(document.getElementById('map'), {
                    //    zoom: 10,
                    //    center: new google.maps.LatLng(locations[0][0], locations[0][1]),
                    //    mapTypeId: google.maps.MapTypeId.ROADMAP
                    //});
                    //var infowindow = new google.maps.InfoWindow();
                    //var marker, i;
                    //for (i = 0; i < locations.length; i++) {
                    //    marker = new google.maps.Marker({
                    //        position: new google.maps.LatLng(locations[i][0], locations[i][1]),
                    //        map: map
                    //    });
                    //    google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    //        return function () {
                    //            //infowindow.setContent(locations[i][0]);
                    //            infowindow.open(map, marker);
                    //        }
                    //    })(marker, i));
                    //}
                };
                reader.readAsText(input.files[0]);
            };
            ;
            return MainController;
        }());
        Controller.MainController = MainController;
    })(Controller = Clarity.Controller || (Clarity.Controller = {}));
})(Clarity || (Clarity = {}));
