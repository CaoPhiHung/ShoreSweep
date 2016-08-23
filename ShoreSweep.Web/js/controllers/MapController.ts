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
    public coordinates: Array<Model.Coordinate>;

    constructor(private $scope,
      public $rootScope: IRootScope,
      private $http: ng.IHttpService,
      public $location: ng.ILocationService,
      public $mdDialog: any) {

      $scope.viewModel = this;
      this.trashService = new Service.TrashService($http);
      this.userService = new Service.UserService($http);
      this.mainHelper = new helper.MainHelper();

      this.selectedTrashInformationList = this.$rootScope.selectedTrashInfoList;
      this.initCoordinates();
    }

    initCoordinates() {
      this.coordinates = [];
      for (var i = 0; i < this.selectedTrashInformationList.length; i++) {
        var coordinate = new Model.Coordinate(this.selectedTrashInformationList[i].longitude, this.selectedTrashInformationList[i].latitude);
        this.coordinates.push(coordinate);
      }
    }

  }
}