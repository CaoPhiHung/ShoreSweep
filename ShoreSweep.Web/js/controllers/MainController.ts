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
    public trashes: Array<Model.TrashInformationModel>;
    public trashInformationList: Array<Model.TrashInformationModel>;
    public showSpinner: boolean;

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
      this.showSpinner = true;
      this.trashService.getAll((data) => {
        this.trashInformationList = data;
        this.showSpinner = false;
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

    importCSVFile() {
      this.isImportLoading = true;
      this.trashService.importTrashRecord(this.trashes,
        (data) => {
          this.initTrashInformationList();
        }, (data) => { });
    }

    openFile(event) {
      var input = event.target;
      var self = this;
      var reader = new FileReader();
      reader.onload = function () {

        var records = reader.result.split('\n');
        for (var line = 1; line < records.length; line++) {
          var record = records[line].split(';');
          var trash = new Model.TrashInformationModel();
          trash.trashId = record[0];
          trash.latitude = record[1];
          trash.longitude = record[2];
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





  }
}