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
    public showSpinner: boolean;

    public trashService: service.TrashService;
    public userService: service.UserService;

    public trashInformationList: Array<Model.TrashInformationModel>;
    public importTrashList: Array<Model.TrashInformationModel>;

    constructor(private $scope,
      public $rootScope: IRootScope,
      private $http: ng.IHttpService,
      public $location: ng.ILocationService,
      public $mdDialog: any) {

      $scope.viewModel = this;
      this.trashService = new Service.TrashService($http);
      this.userService = new Service.UserService($http);
      this.mainHelper = new helper.MainHelper();
      this.initTrashInformationList();
    }

    initTrashInformationList() {
      this.showSpinner = true;
      this.trashService.getAll((data) => {
        for (var i = 0; i < data.length; i++) {
          this.initFirstImage(data[i]);
        }
        this.trashInformationList = data;
        this.showSpinner = false;
      }, (data) => { });
    }

    showGoogleMapDialog(trashInfo: Model.TrashInformationModel, event: Event) {
      var self = this;

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
      this.trashService.importTrashRecord(this.importTrashList,
        (data) => {
          this.onImportTrashListSuccess(data);
        },
        (data) => {
          //this.onImportUserError(data);
        });
    }

    onImportTrashListSuccess(data: Array<Model.TrashInformationModel>) {
      for (var i = 0; i < data.length; i++) {
        this.initFirstImage(data[i]);
        this.trashInformationList.push(data[i]);
      }
      alert('Imported ' + data.length + ' records');
    }

    initFirstImage(trash: Model.TrashInformationModel) {
      trash.imageList = trash.images.split(',');
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
      this.importTrashList = [];
      reader.onload = function () {

        var records = reader.result.split('\n');
        for (var line = 1; line < 10 /*records.length*/; line++) {
          var record = records[line].split(';');
          var trash = new Model.TrashInformationModel();
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
          trash.size = record[14];
          trash.type = record[15];
          self.importTrashList.push(trash);
        }

      };
      reader.readAsText(input.files[0]);
    };

    addAdmin() {
      var admin = new Model.UserModel();
      admin.firstName = 'Hung';
      admin.lastName = 'Cao';
      admin.username = 'phihung';
      admin.password = 'Test1234';
      this.userService.create(admin, function () { }, this.$rootScope.onError);
    }

    addAssignee() {
      var assignee = new Model.AssigneeModel();
      assignee.username = 'Hung';
      this.userService.createAssigne(assignee, function () { }, this.$rootScope.onError);
    }

    updateRecord() {
      var trashList = [];
      for (var i = 0; i < this.trashInformationList.length; i++){
        if (this.trashInformationList[i].isSelected) {
          trashList.push(this.trashInformationList[i]);
        }
      }
      this.trashService.uploadTrashRecord(trashList,
        (data) => {
          //this.onImportTrashListSuccess(data);
        },
        (data) => {
          //this.onImportUserError(data);
        });
    }

    showMapAndTrash() {
      this.$rootScope.selectedTrashInfoList = [];
      for (var i = 0; i < this.trashInformationList.length; i++) {
        var trashInfo = this.trashInformationList[i];
        if (trashInfo.isSelected) {
          this.$rootScope.selectedTrashInfoList.push(trashInfo);
        }
      }

      this.$location.path('/show_map_and_trash');
    }

  }
}