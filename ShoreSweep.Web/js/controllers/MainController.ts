/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />
/// <reference path="IController.ts" />
/// <reference path="../services/AuthenticationService.ts" />

declare var VERSION_NUMBER;

module Clarity.Controller {
    import service = Clarity.Service;
    import helper = Clarity.Helper;

    export class MainController {
        public mainHelper: helper.MainHelper;

        public excelFileUpload: any;
        public errorMessage: string;
        public isImportLoading: boolean;
        public trashService: service.TrashService;
        public trashes: Model.TrashModel[];
        public trashInformationList: Array<Model.TrashInformationModel>;

        constructor(private $scope,
            public $rootScope: IRootScope,
            private $http: ng.IHttpService,
            public $mdDialog: any) {

      $scope.viewModel = this;
      this.trashService = new Service.TrashService($http);
      this.mainHelper = new helper.MainHelper();
      this.trashes = [];
      this.initTrashInformationList();
    }

    initTrashInformationList() {
      this.trashService.getAll((data) => {
        this.trashInformationList = data;
      }, (data) => { });
    }

    showGoogleMapDialog(trashInfo: Model.TrashInformationModel, event: Event) {
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
    }


    uploadFile(element) {
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
        }

        importCSVFile() {
            this.isImportLoading = true;
            //this.trashService.importCSV(this.excelFileUpload,
            //    (data) => {
            //        //this.onImportUserSuccess(data);
            //    },
            //    (data) => {
            //        //this.onImportUserError(data);
            //    });
            this.trashService.importTrashRecord(this.trashes,
                (data) => {
                    //this.onImportUserSuccess(data);
                },
                (data) => {
                    //this.onImportUserError(data);
                });
        }

        isValidFileType(fileName) {
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
        }

        checkFileSize(size) {
            if (size > 20971520) {
                this.errorMessage = 'File size exceeds 20MB limit.';
                return false;
            }
            return true;
        }

        openFile(event) {

            var input = event.target;
            var self = this;
            var reader = new FileReader();
            reader.onload = function () {

                var records = reader.result.split('\n');
                for (var line = 1; line < records.length; line++) {
                    var record = records[line].split(';');
                    var trash = new Model.TrashModel();
                    trash.id = record[0];
                    trash.latitude = record[1];
                    trash.longtitude = record[2];
                    trash.description = record[10];
                    trash.status = record[11];
                    trash.images = record[13];
                    self.trashes.push(trash);
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

        //public deleteKioskLogConfirm(index: number, event: Event) {
        //  var confirm = this.$mdDialog.confirm()
        //    .clickOutsideToClose(true)
        //    .title('Would you like to delete your kiosk log?')
        //    .targetEvent(event)
        //    .ok('OK')
        //    .cancel('Cancel');

        //  var self = this;
        //  this.$mdDialog.show(confirm).then(function () {
        //    //self.deleteKioskLog(index);
        //  }, function () { });
        //}

        //public showColorDialog(kioskLog: Model.KioskLogModel, event: Event) {
        //  var self = this;

        //  this.$mdDialog.show({

        //    controller: function ($scope, $mdDialog, kioskLog) {
        //      $scope.defaultColors = self.$scope.viewModel.defaultColors;

        //      $scope.hide = function () {
        //        $mdDialog.hide();
        //      };
        //      $scope.cancel = function () {
        //        $mdDialog.cancel();
        //      };
        //      $scope.selectColor = function (color) {
        //        kioskLog.color = color;
        //        $mdDialog.hide();
        //      };
        //    },

        //    templateUrl: '/html/color-dialog.html' + '?v=' + VERSION_NUMBER,
        //    targetEvent: event,
        //    clickOutsideToClose: true,
        //    locals: {
        //      kioskLog: kioskLog
        //    }

        //  })
        //    .then(function (answer) { }, function () { });
        //}

   


  }
}