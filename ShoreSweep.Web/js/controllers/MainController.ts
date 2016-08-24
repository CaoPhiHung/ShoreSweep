/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />
/// <reference path="IController.ts" />
/// <reference path="../services/AuthenticationService.ts" />
/// <reference path="../../lib/google/google.maps.d.ts" />

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
    public currentPage: number;
    public itemsPerPage: number;
    public maxPageSize: number;
    public numPages: number;
    public showAdminForm: boolean;
    public showAssigneeForm: boolean;
    public assigneeName: string;
    public adminFirstName: string;
    public adminLastName: string;
    public adminUserName: string;
    public adminPassword: string;

    public trashService: service.TrashService;
    public userService: service.UserService;
    public polygonService: service.PolygonService;

    public trashInformationList: Array<Model.TrashInformationModel>;
    public importTrashList: Array<Model.TrashInformationModel>;
    public polygonList: Array<Model.PolygonModel>;
    public assigneeList: Array<Model.AssigneeModel>;

    constructor(private $scope,
      public $rootScope: IRootScope,
      private $http: ng.IHttpService,
      public $location: ng.ILocationService,
      public $mdDialog: any) {

      $scope.viewModel = this;
      this.trashService = new Service.TrashService($http);
      this.userService = new Service.UserService($http);
      this.polygonService = new Service.PolygonService($http);

      this.polygonList = [];
      this.mainHelper = new helper.MainHelper();
      this.initTrashInformationList();
      this.initPolygonList();
      this.initAssigneeList();
      this.itemsPerPage = 5;
      this.currentPage = 1;
      this.maxPageSize = 5;
      this.showAdminForm = false;
      this.showAssigneeForm = false;
    }

    initTrashInformationList() {
      this.showSpinner = true;
      this.trashService.getAll((data) => {
        for (var i = 0; i < data.length; i++) {
          this.initFirstImage(data[i]);
        }
        this.trashInformationList = data;
        this.numPages = Math.ceil(this.trashInformationList.length / this.itemsPerPage);
        this.showSpinner = false;
      }, (data) => { });
    }

    initPolygonList() {
      this.polygonService.getAll((data) => {
        this.polygonList = data;
      }, (data) => { });
    }

    initAssigneeList() {
      this.userService.getAllAssigne((data) => {
        this.assigneeList = data;
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
      var self = this;
      this.isImportLoading = true;
      this.trashService.importCSV(this.excelFileUpload,
          (data) => {
              //this.onImportUserSuccess(data);
          },
          (data) => {
          });
      if (this.importTrashList) {
        this.trashService.importTrashRecord(this.importTrashList,
          (data) => {
            self.onImportTrashListSuccess(data);
          },
          (data) => {
          });
      } else {
        alert('Please choose the csv file!!!');
      }
    }

    importPolygons() {
      if (this.polygonList) {
        var self = this;
        this.polygonService.importPolygons(this.polygonList, (data) => this.onImportPolygonSuccess(data), function () { });
      } else {
        alert('Please choose the kml file!!!');
      }
    }

    onImportPolygonSuccess(data: Array<Model.PolygonModel>) {
      this.polygonList = data;
      for (var i = 0; i < data.length; i++) {
        var polygon = new google.maps.Polygon({
          paths: data[i].coordinates,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        for (var j = 0; j < this.trashInformationList.length; j++){
          var isWithinPolygon = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(this.trashInformationList[j].latitude, this.trashInformationList[j].longitude), polygon);
          if (isWithinPolygon) {
            this.trashInformationList[j].sectionId = data[i].id;
          }
        }
      }

      if (this.polygonList && this.trashInformationList) {
        this.trashService.updateTrashRecord(this.trashInformationList, function () { }, function () { });
      }
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

    openKMLFile(event) {
      var input = event.target;
      var self = this;
      var reader = new FileReader();
      reader.onload = function () {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(reader.result, "text/xml");
        var placemarks = xmlDoc.getElementsByTagName('Placemark');

        for (var i = 0; i < placemarks.length; i++){
          var polygon = new Model.PolygonModel();
          polygon.name = placemarks[i].getElementsByTagName('name')[0].textContent;
          polygon.coordinates = [];

          var coordinates = placemarks[i].getElementsByTagName('coordinates')[0].textContent.split(',0.0');
          for (var j = 0; j < coordinates.length; j++){
            var long = parseFloat(coordinates[j].split(',')[0]);
            var lat = parseFloat(coordinates[j].split(',')[1]);
            if (long && lat){
              var coordinate = new Model.Coordinate(long, lat);
              polygon.coordinates.push(coordinate);
            }
          }

          self.polygonList.push(polygon);
        }
      };
      reader.readAsText(input.files[0]);
    }

    addAdmin() {
      this.showAdminForm = true;
    }

    addNewAdmin() {
      var self = this;
      var admin = new Model.UserModel();
      admin.firstName = this.adminFirstName;
      admin.lastName = this.adminLastName;
      admin.username = this.adminUserName;
      admin.password = this.adminPassword;
      this.userService.create(admin, (data) => {
        self.showAdminForm = false;
      }
      , this.$rootScope.onError);
    }

    addAssignee() {
      this.showAssigneeForm = true;
    }

    addNewAssignee() {
      var assignee = new Model.AssigneeModel();
      assignee.username = this.assigneeName;
      var self = this;
      this.userService.createAssigne(assignee, (data) => {
        self.showAssigneeForm = false;
        self.assigneeList.push(data);
      }, this.$rootScope.onError);
    }

    updateRecord() {
      var trashList = [];
      for (var i = 0; i < this.trashInformationList.length; i++) {
        if (this.trashInformationList[i].isSelected) {
          trashList.push(this.trashInformationList[i]);
        }
      }
      this.trashService.updateTrashRecord(trashList,
        (data) => {
          alert('Updated ' + data.length + ' records');
        },
        (data) => {
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

    itemsPerPageChanged(itemsPerPage) {
      this.currentPage = 1;
      this.numPages = Math.ceil(this.trashInformationList.length / itemsPerPage);
      return this.currentPage;
    }

    goToNextPage() {
      this.currentPage += 1;
      return this.currentPage;
    }

    getPageNumber = function () {
      return this.currentPage;
    }

    goToPreviousPage() {
      this.currentPage -= 1;
      return this.currentPage;
    }

    getSectionName(id) {
      if (id && this.polygonList) {
        for (var i = 0; i < this.polygonList.length; i++){
          if (id == this.polygonList[i].id) {
            return this.polygonList[i].name;
          }
        }
      }
      return '';
    }

    goToMainPage() {
      this.showAdminForm = false;
      this.showAssigneeForm = false;
    }

  }
}