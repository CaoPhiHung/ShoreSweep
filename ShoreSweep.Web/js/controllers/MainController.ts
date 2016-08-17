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

    constructor(private $scope,
      public $rootScope: IRootScope,
      private $http: ng.IHttpService,
      public $mdDialog: any) {

      $scope.viewModel = this;
      this.trashService = new Service.TrashService($http);
      this.mainHelper = new helper.MainHelper();
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
      this.trashService.importCSV(this.excelFileUpload,
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

    //public DialogController($scope, $mdDialog) {
    //  $scope.hide = function () {
    //    $mdDialog.hide();
    //  };
    //  $scope.cancel = function () {
    //    $mdDialog.cancel();
    //  };
    //  $scope.answer = function (answer) {
    //    $mdDialog.hide(answer);
    //  };
    //}

   


  }
}