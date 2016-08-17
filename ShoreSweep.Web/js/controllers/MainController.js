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
            }
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
                this.isImportLoading = true;
                this.trashService.importCSV(this.excelFileUpload, function (data) {
                    //this.onImportUserSuccess(data);
                }, function (data) {
                    //this.onImportUserError(data);
                });
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
            return MainController;
        }());
        Controller.MainController = MainController;
    })(Controller = Clarity.Controller || (Clarity.Controller = {}));
})(Clarity || (Clarity = {}));
