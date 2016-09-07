/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />
/// <reference path="IController.ts" />
/// <reference path="../services/AuthenticationService.ts" />

declare var VERSION_NUMBER;

module Clarity.Controller {
  import service = Clarity.Service;
  import helper = Clarity.Helper;

  export class MapController {
    public mainHelper: helper.MainHelper;

    public showSpinner: boolean;

    public trashService: service.TrashService;
    public userService: service.UserService;

    public selectedTrashInformationList: Array<Model.TrashInformationModel>;
    public markers: Array<Model.Marker>;

    public selectedTrashInfo: Model.TrashInformationModel;

    constructor(private $scope,
      public $rootScope: IRootScope,
      private $http: ng.IHttpService,
      public $location: ng.ILocationService,
      public $window: ng.IWindowService,
      public $mdDialog: any) {

      $scope.viewModel = this;
      this.trashService = new Service.TrashService($http);
      this.userService = new Service.UserService($http);
      this.mainHelper = new helper.MainHelper();
      this.selectedTrashInformationList = angular.fromJson(this.$window.sessionStorage.getItem('selectedTrashInfoList'));
      this.selectedTrashInfo = angular.fromJson(this.$window.sessionStorage.getItem('selectedTrashInfo'));
      this.initMarkers();
    }

    initMarkers() {
      this.markers = [];
      if (this.selectedTrashInformationList != null && this.selectedTrashInformationList.length > 0) {
        for (var i = 0; i < this.selectedTrashInformationList.length; i++) {
          var trashInfo = this.selectedTrashInformationList[i];
          var marker = new Model.Marker(trashInfo.id, trashInfo.size, trashInfo.longitude, trashInfo.latitude);
          this.markers.push(marker);
        }
      }
    }

  }
}