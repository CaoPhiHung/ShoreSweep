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
    public pagingOptions: Array<any>;
    public search: any;
    public searchText: any;
    public searchType: any;
		public statusList: Array<string>;
		public sizesList: Array<string>;
		public typesList: Array<string>;

    public trashService: service.TrashService;
    public userService: service.UserService;
    public polygonService: service.PolygonService;

    public trashInfoViewModelList: Array<Model.TrashInformationViewModel>;
		public trashInfoModelList: Array<Model.TrashInformationModel>;

    public importTrashList: Array<Model.TrashInformationModel>;
    public polygonList: Array<Model.PolygonModel>;
    public importPolygonList: Array<Model.PolygonModel>;
    public assigneeList: Array<Model.AssigneeModel>;
    public selectedAll: boolean;
    public trashInfoViewModelsOnPage: Array<Model.TrashInformationViewModel>;
    //sorting
    public propertyName: string;// = 'age';
    public isReverse: boolean;// = true;

    constructor(private $scope,
      public $rootScope: IRootScope,
      private $http: ng.IHttpService,
      public $location: ng.ILocationService,
      public $window: ng.IWindowService,
      public $mdDialog: any,
      public $filter: ng.IFilterService) {

      $scope.viewModel = this;
      this.trashService = new Service.TrashService($http);
      this.userService = new Service.UserService($http);
      this.polygonService = new Service.PolygonService($http);

      this.polygonList = [];
      this.mainHelper = new helper.MainHelper();
      this.initTrashInfoViewModelList();

      //sorting
      this.propertyName = 'id';
      this.isReverse = false;

			this.statusList = ['Unconfirmed', 'Confirmed', 'Cleaned'];
			this.sizesList = ['Small', 'Medium', 'Large'];
			this.typesList = ['Household', 'Automotive', 'Construction', 'Plastic', 'Electronic',
				'Glass', 'Metal', 'Liquid', 'Dangerous'];

      this.search = {};
      var self = this;
      this.$scope.$watch('viewModel.searchText', (newVal, oldVal) => {
        if ((oldVal == newVal) || oldVal == undefined || newVal == undefined || newVal == null)
          return;
        switch (self.searchType) {
					case '0':
            self.search = { id: newVal };
            break;
					case '1':
            self.search = { description: newVal };
            break;
					case '2':
            self.search = { comment: newVal };
            break;
          case '3':
            self.search = { status: newVal };
            break;
          case '4':
            self.search = { size: newVal };
            break;
          case '5':
            self.search = { type: newVal };
            break;
          case '6':
            self.search = { secionName: newVal };
            break;
          case '7':
            self.search = { assigneeName: newVal };
            break;
          default:
            break;
        }

        self.numPages = Math.ceil($filter('filter')(this.trashInfoViewModelList, newVal).length / self.itemsPerPage);
        self.trashInfoViewModelsOnPage = $filter('filter')(this.trashInfoViewModelList, newVal);
        self.currentPage = 1;
      }, true);
    }

    initTrashInfoViewModelList() {
      this.showSpinner = true;
      this.$rootScope.showSpinner();
      this.trashService.getAll((data) => {
        this.trashInfoViewModelList = data;
        this.trashInfoViewModelsOnPage = this.trashInfoViewModelList.slice(0);
        this.initPolygonList();
				this.initAssigneeList();
        this.initPaging();
        this.showSpinner = false;
        this.$rootScope.hideSpinner();
      }, (data) => { });
    }

    initPolygonList() {
      var self = this;
      this.polygonService.getAll((data) => {
        self.polygonList = data;
        for (var i = 0; i < self.polygonList.length; i++) {
          for (var j = 0; j < self.trashInfoViewModelList.length; j++) {
						var trash = self.trashInfoViewModelList[j];
            if (trash.sectionId && trash.sectionId == self.polygonList[i].id) {
							trash.sectionName = self.polygonList[i].name;
              trash.polygonCoords = self.polygonList[i].coordinates;
            }
          }
        }
      }, (data) => { });
    }

    initAssigneeList() {
			var self = this;
      this.userService.getAllAssignee((data) => {
        self.assigneeList = data;
				for (var i = 0; i < self.trashInfoViewModelList.length; i++) {
					var trash = self.trashInfoViewModelList[i];
					trash.assigneeName = self.getAssigneeName(trash.assigneeId);
				}
      }, (data) => { });
    }

    initPaging() {
      this.itemsPerPage = 50;
      this.currentPage = 1;
      this.maxPageSize = 5;
      this.numPages = Math.ceil(this.trashInfoViewModelList.length / this.itemsPerPage);
    }

		mapTrashInfoViewModelToTrashModel(trashViewInfo: Model.TrashInformationViewModel) {

			var trashInfo = new Model.TrashInformationModel();
			trashInfo.id = trashViewInfo.id;
			trashInfo.trashId = trashViewInfo.trashId;
			trashInfo.latitude = trashViewInfo.latitude;
			trashInfo.longitude = trashViewInfo.longitude;
			trashInfo.continent = trashViewInfo.continent;
			trashInfo.country = trashViewInfo.country;
			trashInfo.administrativeArea1 = trashViewInfo.administrativeArea1;
			trashInfo.administrativeArea2 = trashViewInfo.administrativeArea2;
			trashInfo.administrativeArea3 = trashViewInfo.administrativeArea3;
			trashInfo.locality = trashViewInfo.locality;
			trashInfo.subLocality = trashViewInfo.subLocality;
			trashInfo.description = trashViewInfo.description;
			trashInfo.comment = trashViewInfo.comment;
			trashInfo.status = trashViewInfo.status;
			trashInfo.url = trashViewInfo.url;
			trashInfo.images = trashViewInfo.images;
			trashInfo.size = trashViewInfo.size;
			trashInfo.type = trashViewInfo.type;
			trashInfo.assigneeId = trashViewInfo.assigneeId;
			trashInfo.sectionId = trashViewInfo.sectionId;

			return trashInfo;
		}

    showGoogleMapDialog(trashInfo: Model.TrashInformationViewModel, event: Event) {
			trashInfo.assigneeName = this.getAssigneeName(trashInfo.assigneeId);
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

    importCSVFile() {
      var self = this;
      if (this.importTrashList) {
        this.$rootScope.showSpinner();
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

    onImportTrashListSuccess(data: Array<Model.TrashInformationViewModel>) {
      for (var i = 0; i < data.length; i++) {
        this.trashInfoViewModelList.push(data[i]);
      }
      if (data.length > 0) {
        this.numPages = Math.ceil(this.trashInfoViewModelList.length / this.itemsPerPage);
				this.trashInfoViewModelsOnPage = this.trashInfoViewModelList.slice(0);
        this.currentPage = 1;
				this.updateSectionId();
        alert('Imported ' + data.length + ' records');
      } else {
        alert('Do not have any new record!!!');
				this.$rootScope.hideSpinner();
      }

    }

    importPolygons() {
      if (this.importPolygonList) {
        this.$rootScope.showSpinner();
        var self = this;
        this.polygonService.importPolygons(this.importPolygonList, (data) => this.onImportPolygonSuccess(data), function () { });
      } else {
        alert('Please choose the kml file!!!');
      }
    }

    onImportPolygonSuccess(data: Array<Model.PolygonModel>) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          this.polygonList.push(data[i]);
        }
        this.updateSectionId();
      }
    }

    updateSectionId() {
      var updatedList = [];
			if (this.polygonList && this.polygonList.length > 0){
				for (var i = 0; i < this.polygonList.length; i++) {
					var checkedPolygon = this.polygonList[i];
					var polygon = new google.maps.Polygon({
						paths: checkedPolygon.coordinates
					});

					for (var j = 0; j < this.trashInfoViewModelList.length; j++) {
						var trash = this.trashInfoViewModelList[j];

						if (trash && trash.latitude && trash.longitude) {
							var latLng = new google.maps.LatLng(trash.latitude, trash.longitude);
							var isWithinPolygon = google.maps.geometry.poly.containsLocation(latLng, polygon);

							if (isWithinPolygon && trash.sectionId != checkedPolygon.id) {
								trash.sectionName = checkedPolygon.name;
								trash.sectionId = checkedPolygon.id;
								trash.polygonCoords = checkedPolygon.coordinates;
								updatedList.push(trash);
							}
						}
					}
				}
				var self = this;
				if (updatedList.length > 0) {
					this.trashService.updateTrashRecord(updatedList, (data) => function (data) {
						self.$rootScope.hideSpinner();
					}
					, function () { });
				}
			}
			this.$rootScope.hideSpinner();
		}

    //isValidFileType(fileName) {
    //  if (fileName != null) {
    //    var fileNameParts = fileName.split('.');
    //    if (fileNameParts.length > 1) {
    //      var fileNameExtension = fileNameParts[fileNameParts.length - 1];
    //      if (fileNameExtension.toLowerCase() === 'csv') {
    //        return true;
    //      }
    //    }
    //  }

    //  this.errorMessage = 'File format is not supported. Please upload a csv file.';
    //  return false;
    //}

    //checkFileSize(size) {
    //  if (size > 20971520) {
    //    this.errorMessage = 'File size exceeds 20MB limit.';
    //    return false;
    //  }
    //  return true;
    //}

    openFile(event) {
      var input = event.target;
      var self = this;
      var reader = new FileReader();
      this.importTrashList = [];
      reader.onload = function () {

        var records = reader.result.split('\n');
        for (var line = 1; line < 200 /*records.length*/; line++) {
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
          trash.images = record[13].trim().split(',');
					if (trash.images[trash.images.length - 1] == '') {
						trash.images.splice(trash.images.length - 1, 1);
					}
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
      self.importPolygonList = [];
      var reader = new FileReader();
      reader.onload = function () {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(reader.result, "text/xml");
        var placemarks = xmlDoc.getElementsByTagName('Placemark');

        for (var i = 0; i < placemarks.length; i++) {
          var polygon = new Model.PolygonModel();
          polygon.name = placemarks[i].getElementsByTagName('name')[0].textContent;
          polygon.coordinates = [];

          var coordinates = placemarks[i].getElementsByTagName('coordinates')[0].textContent.split(',0.0');
          for (var j = 0; j < coordinates.length; j++) {
            var long = parseFloat(coordinates[j].split(',')[0]);
            var lat = parseFloat(coordinates[j].split(',')[1]);
            if (long && lat) {
              var coordinate = new Model.Coordinate(long, lat);
              polygon.coordinates.push(coordinate);
            }
          }

          self.importPolygonList.push(polygon);
        }
      };
      reader.readAsText(input.files[0]);
    }

    updateRecord(event: Event) {

			var self = this;
      this.$mdDialog.show({
        controller: function ($scope, $mdDialog) {
					$scope.trashInfo = new Model.TrashInformationModel();
					$scope.viewModel = self;
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.update = function () {
						var trashList = [];
						for (var i = 0; i < self.trashInfoViewModelList.length; i++) {
							var trash = self.trashInfoViewModelList[i];
							if (trash.isSelected) {
								trash.status = $scope.trashInfo.status;
								trash.assigneeId = $scope.trashInfo.assigneeId;
								trashList.push(self.mapTrashInfoViewModelToTrashModel(trash));
							}
						}
						self.trashService.updateTrashRecord(trashList,
							(data) => {
								alert('Updated ' + data.length + ' new records!!!');
								$mdDialog.hide();
							},
							(data) => {
							});
          };
        },

        templateUrl: '/html/update-record-dialog.html' + '?v=' + VERSION_NUMBER,
        targetEvent: event,
        clickOutsideToClose: false
      })
        .then(function (answer) { }, function () { });
    }

		deleteRecord() {
			var trashList = [];
			for (var i = 0; i < this.trashInfoViewModelList.length; i++) {
				var trash = this.trashInfoViewModelList[i];
				if (trash.isSelected) {
					trashList.push(trash.id);
				}
			}
			if (window.confirm('Are you sure you want to delete ' + trashList.length + ' records')) {
				var self = this;
				this.trashService.deleteTrashRecord(trashList,
					(data) => {
						for (var i = self.trashInfoViewModelList.length - 1; i >= 0; i--) {
							var trash = self.trashInfoViewModelList[i];
							for (var j = 0; j < data.length; j++) {
								if (data[j].id == trash.id) {
									self.trashInfoViewModelList.splice(i, 1);
									break;
								}
							}
						}
						self.numPages = Math.ceil(self.trashInfoViewModelList.length / self.itemsPerPage);
						self.trashInfoViewModelsOnPage = self.trashInfoViewModelList.slice(0);
						alert('Delete ' + data.length + ' records!!!');
					},
					(data) => {
					});
			}
		}

    enableUpdateOrShowMap() {
      if (this.trashInfoViewModelList != null && this.trashInfoViewModelList.length > 0) {
        for (var i = 0; i < this.trashInfoViewModelList.length; i++) {
          if (this.trashInfoViewModelList[i].isSelected) {
            return true;
          }
        }
      }
      return false;
    }

    showMapAndTrash() {
      var selectedTrashInfoList = [];
      for (var i = 0; i < this.trashInfoViewModelList.length; i++) {
        var trashInfo = this.trashInfoViewModelList[i];
        if (trashInfo.isSelected) {
          selectedTrashInfoList.push(trashInfo);
        }
      }
      this.$window.sessionStorage.setItem('selectedTrashInfoList', angular.toJson(selectedTrashInfoList));
      this.$window.open('/#/show_map_and_trash');
    }

    itemsPerPageChanged(itemsPerPage) {
      this.currentPage = 1;
      this.numPages = Math.ceil(this.trashInfoViewModelList.length / itemsPerPage);
			this.trashInfoViewModelsOnPage = this.trashInfoViewModelList.slice(0);
      return this.currentPage;
    }

    goToNextPage() {
      this.currentPage += 1;
      return this.currentPage;
    }

    getPageNumber() {
      return this.currentPage;
    }

    goToPreviousPage() {
      this.currentPage -= 1;
      return this.currentPage;
    }

    getSectionName(id) {
      if (id && this.polygonList) {
        for (var i = 0; i < this.polygonList.length; i++) {
          if (id == this.polygonList[i].id) {
            return this.polygonList[i].name;
          }
        }
      }
      return '';
    }

    getAssigneeName(id) {
      if (id && this.assigneeList) {
        for (var i = 0; i < this.assigneeList.length; i++) {
          if (id == this.assigneeList[i].id) {
            return this.assigneeList[i].username;
          }
        }
      }
      return '';
    }

		showAssigneeDialog(event: Event) {
      var self = this;
      this.$mdDialog.show({
        controller: function ($scope, $mdDialog) {
          $scope.assignee = new Model.AssigneeModel();
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.create = function () {
            self.userService.createAssignee($scope.assignee,
              (data) => {
                self.assigneeList.push(data);
                $mdDialog.hide();
              },
              (data) => { });
          };
        },

        templateUrl: '/html/assignee-dialog.html' + '?v=' + VERSION_NUMBER,
        targetEvent: event,
        clickOutsideToClose: false
      })
        .then(function (answer) { }, function () { });
    }

		showImportCSVDialog(event: Event) {
      var self = this;
      this.$mdDialog.show({
        controller: function ($scope, $mdDialog) {
					$scope.viewModel = self;
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.import = function () {
            self.importCSVFile();
						$mdDialog.hide();
          };
        },

        templateUrl: '/html/import-csv-dialog.html' + '?v=' + VERSION_NUMBER,
        targetEvent: event,
        clickOutsideToClose: false
      })
        .then(function (answer) { }, function () { });
    }

    showImportKMLDialog(event: Event) {
      var self = this;
      this.$mdDialog.show({
        controller: function ($scope, $mdDialog) {
          $scope.viewModel = self;
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.import = function () {
            self.importPolygons();
						$mdDialog.hide();
          };
        },

        templateUrl: '/html/import-kml-dialog.html' + '?v=' + VERSION_NUMBER,
        targetEvent: event,
        clickOutsideToClose: false
      })
        .then(function (answer) { }, function () { });
    }

    showAdminUserDialog(event: Event) {
      var self = this;
      this.$mdDialog.show({
        controller: function ($scope, $mdDialog) {
          $scope.adminUser = new Model.UserModel();
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.create = function () {
            self.userService.create($scope.adminUser,
              (data) => {
                $mdDialog.hide();
              },
              (data) => { });
          };
        },

        templateUrl: '/html/admin-dialog.html' + '?v=' + VERSION_NUMBER,
        targetEvent: event,
        clickOutsideToClose: false
      })
        .then(function (answer) { }, function () { });
    }

		updateTrashInfoChange(trashInfo: Model.TrashInformationViewModel) {
			var trashList = [];
			trashList.push(this.mapTrashInfoViewModelToTrashModel(trashInfo));
			this.trashService.updateTrashRecord(trashList,
        (data) => {
          //alert('Updated ' + property + ' Successfully!!!');
        },
        (data) => {
        });
    }

    onchangeSelectedAll() {
      var startItem = (this.currentPage - 1) * parseInt(this.itemsPerPage.toString());
      var endItem = startItem + parseInt(this.itemsPerPage.toString());

      for (var i = startItem; i < endItem; i++) {
        if (i >= this.trashInfoViewModelsOnPage.length) {
          break;
        }
        this.trashInfoViewModelsOnPage[i].isSelected = this.selectedAll;
      }
    }

    sortBy(propertyName: string) {
      this.isReverse = (propertyName !== null && this.propertyName === propertyName)
        ? !this.isReverse : false;
      this.propertyName = propertyName;
      this.trashInfoViewModelsOnPage = this.$filter('orderBy')(this.trashInfoViewModelList, this.propertyName, this.isReverse);
    }

		showSearchDropDowList() {
			switch (this.searchType) {
				case '0':
				case '1':
				case '2':
					return false;
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
					return true;
				default:
					return false;
			}
		}
		
		onSearchTypeChange() {
			this.searchText = null;
			this.search = {};
		}

  }
}