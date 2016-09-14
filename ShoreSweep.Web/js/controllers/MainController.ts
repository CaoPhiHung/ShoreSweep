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
		public statusList: Array<any>;
		public sizesList: Array<any>;
		public typesList: Array<any>;

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
		public userName: string;

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
			this.userName = this.$rootScope.user.username;

			this.statusList = [0, 1, 2];
			this.sizesList = ['Small', 'Medium', 'Large'];
			this.typesList = ['Household', 'Automotive', 'Construction', 'Plastic', 'Electronic',
				'Glass', 'Metal', 'Liquid', 'Dangerous'];

			this.search = {};
			var self = this;
			this.$scope.$watch('viewModel.searchText', (newVal, oldVal) => {
				if ((oldVal == newVal) || (oldVal == undefined && newVal == undefined) || newVal == null)
					return;
				switch (self.searchType) {
					case '0':
						self.search = { customId: newVal };
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
						if (newVal == 'null') {
							self.search = { sectionId: null };
						} else {
							self.search = { sectionName: newVal };
						}
						break;
					case '7':
						self.search = { assigneeId: newVal };
						break;
					default:
						break;
				}
				self.clearAllSelected();
				self.numPages = Math.ceil($filter('filter')(this.trashInfoViewModelList, self.search).length / self.itemsPerPage);

        var trashList = this.$filter('orderBy')(this.trashInfoViewModelList, self.propertyName, self.isReverse);
        self.trashInfoViewModelsOnPage = $filter('filter')(trashList, self.search);

				self.currentPage = 1;
			}, true);
		}

		updateModifiedDate(trashInfoViewModelList: Array<Model.TrashInformationViewModel>, trashId?: number, modifiedDate?: Date) {
			if (trashId && modifiedDate) {//update defined record
				for (var i = 0; i < trashInfoViewModelList.length; i++) {
					var trashInfo = trashInfoViewModelList[i];
					if (trashInfo.id === trashId) {
						trashInfo.modifiedDate = this.mainHelper.convertToESTTimeZone(new Date(modifiedDate.toString()));
						trashInfo.formatedModifiedDate = this.mainHelper.formatDateToString(trashInfo.modifiedDate);
						break;
					}
				}
			} else {//update all records
				for (var i = 0; i < trashInfoViewModelList.length; i++) {
					var trashInfo = trashInfoViewModelList[i];
					trashInfo.modifiedDate = this.mainHelper.convertToESTTimeZone(new Date(trashInfo.modifiedDate.toString()));
					trashInfo.formatedModifiedDate = this.mainHelper.formatDateToString(trashInfo.modifiedDate);
				}
			}
		}

		getTypeString(types) {
			var type = '';
			for (var i = 0; i < types.length; i++) {
				if (i == 0) {
					type = this.getTypeStringFromId(types[i]);
				} else {
					type += ', ' + this.getTypeStringFromId(types[i]);
				}
			}
			return type;
		}

		initTrashViewInfoViewModelGeneralInfo() {
			for (var i = 0; i < this.trashInfoViewModelList.length; i++) {
				var trash = this.trashInfoViewModelList[i];
				trash.type = this.getTypeString(trash.types);
				trash.customId = trash.size[0] + this.pad(trash.id, 5);
			}
		}

		initTrashInfoViewModelList() {
			this.showSpinner = true;
			this.$rootScope.showSpinner();
			this.trashService.getAll((data) => {
				this.trashInfoViewModelList = data;
				this.updateModifiedDate(this.trashInfoViewModelList);
				this.trashInfoViewModelsOnPage = this.trashInfoViewModelList.slice(0);
				this.initTrashViewInfoViewModelGeneralInfo();
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
			trashInfo.types = trashViewInfo.types;
			trashInfo.assigneeId = trashViewInfo.assigneeId;
			trashInfo.sectionId = trashViewInfo.sectionId;

			return trashInfo;
    }

    showGoogleMapDialog(trashInfo: Model.TrashInformationViewModel, event: Event) {
      trashInfo.assigneeName = this.getAssigneeName(trashInfo.assigneeId);
      trashInfo.statusName = this.getStatusString(trashInfo.status);
			trashInfo.latitude = parseFloat(trashInfo.latitude.toFixed(3));
			trashInfo.longitude = parseFloat(trashInfo.longitude.toFixed(3));
			trashInfo.customId = trashInfo.size[0] + this.pad(trashInfo.id, 5);
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
				this.showResultDialog('Please choose the csv file', event);
			}
		}

		onImportTrashListSuccess(data: Array<Model.TrashInformationViewModel>) {
			for (var i = 0; i < data.length; i++) {
				data[i].customId = data[i].size[0] + this.pad(data[i].id, 5);
				data[i].type = this.getTypeString(data[i].types);
				this.trashInfoViewModelList.push(data[i]);
			}
			if (data.length > 0) {
				this.numPages = Math.ceil(this.trashInfoViewModelList.length / this.itemsPerPage);
				this.trashInfoViewModelsOnPage = this.trashInfoViewModelList.slice(0);
				this.currentPage = 1;
				this.updateSectionId();
        this.updateModifiedDate(this.trashInfoViewModelList);
        this.showResultDialog('Imported ' + data.length + ' records', event);
      } else {
        this.showResultDialog('Do not have any new record', event);
				this.$rootScope.hideSpinner();
			}
		}

		importPolygons() {
			if (this.importPolygonList) {
				this.$rootScope.showSpinner();
				var self = this;
				this.polygonService.importPolygons(this.importPolygonList, (data) => this.onImportPolygonSuccess(data), function () { });
			} else {
				this.showResultDialog('Please choose the kml file', event);
			}
		}

		onImportPolygonSuccess(data: Array<Model.PolygonModel>) {
			if (data.length > 0) {
				this.polygonList = [];
				for (var i = 0; i < data.length; i++) {
					this.polygonList.push(data[i]);
				}
				this.updateSectionId();
			}
		}

		updateSectionId() {
			var updatedList = [];
			if (this.polygonList && this.polygonList.length > 0) {

				for (var i = 0; i < this.trashInfoViewModelList.length; i++) {
					var trash = this.trashInfoViewModelList[i];
					for (var j = 0; j < this.polygonList.length; j++) {
						var checkedPolygon = this.polygonList[j];
						var polygon = new google.maps.Polygon({
							paths: checkedPolygon.coordinates
						});

						if (trash && trash.latitude && trash.longitude) {
							var latLng = new google.maps.LatLng(trash.latitude, trash.longitude);
							var isWithinPolygon = google.maps.geometry.poly.containsLocation(latLng, polygon);

							if (isWithinPolygon && trash.sectionId != checkedPolygon.id) {
								trash.sectionName = checkedPolygon.name;
								trash.sectionId = checkedPolygon.id;
								trash.polygonCoords = checkedPolygon.coordinates;
								updatedList.push(trash);
								break;
							} else if (isWithinPolygon == false && trash.sectionId != checkedPolygon.id) {
								trash.sectionId = null;
								trash.sectionName = '';
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

		openFile(event) {
			var input = event.target;
			var self = this;
			var reader = new FileReader();
			this.importTrashList = [];
			reader.onload = function () {

				var records = reader.result.split('\n');
				for (var line = 1; line < records.length; line++) {
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
					trash.status = self.getStatusId(record[11]);
					trash.url = record[12];
					trash.images = record[13].trim().split(',');
					if (trash.images[trash.images.length - 1] == '') {
						trash.images.splice(trash.images.length - 1, 1);
					}
					trash.size = record[14];

					trash.types = self.getTypeList(record[15]);
					if (trash.status != 2){
						self.importTrashList.push(trash);
					}
				}
			};
			reader.readAsText(input.files[0]);
		};

		getStatusId(status: string) {
			switch (status.trim().toUpperCase()) {
				case 'UNCONFIRMED':
					return 0;
				case 'UCONFIRMED':
					return 1;
				case 'CLEANED':
					return 2;
				default:
					break;
			}
		}

		getStatusString(status) {
			switch (status) {
				case 0:
					return 'UNCONFIRMED';
				case 1:
					return 'CONFIRMED';
				case 2:
					return 'CLEANED';
				default:
					break;
			}
		}

		getTypeIdFromString(type: string) {
			switch (type.trim().toUpperCase()) {
				case 'HOUSEHOLD':
					return 0;
				case 'AUTOMOTIVE':
					return 1;
				case 'CONSTRUCTION':
					return 2;
				case 'PLASTIC':
					return 3;
				case 'ELECTRONIC':
					return 4;
				case 'GLASS':
					return 5;
				case 'METAL':
					return 6;
				case 'LIQUID':
					return 7;
				case 'DANGEROUS':
					return 8;

				default:
					break;
			}
		}

		getTypeStringFromId(typeId) {
			switch (typeId) {
				case 0:
					return 'HOUSEHOLD';
				case 1:
					return 'AUTOMOTIVE';
				case 2:
					return 'CONSTRUCTION';
				case 3:
					return 'PLASTIC';
				case 4:
					return 'ELECTRONIC';
				case 5:
					return 'GLASS';
				case 6:
					return 'METAL';
				case 7:
					return 'LIQUID';
				case 8:
					return 'DANGEROUS';

				default:
					break;
			}
		}

		getTypeList(types) {
			var typeList = [];
			var list = types.trim().split(',');
			if (list[list.length - 1] == '') {
				list.splice(list.length - 1, 1);
			}

			for (var i = 0; i < list.length; i++) {
				if (list[i] != '') {
					typeList.push(this.getTypeIdFromString(list[i]));
				}
			}
			return typeList;
		}

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
								if ($scope.trashInfo.status && $scope.trashInfo.status != '') {
									trash.status = $scope.trashInfo.status;
								}
								if ($scope.trashInfo.assigneeId) {
									trash.assigneeId = $scope.trashInfo.assigneeId;
								}
								if ($scope.trashInfo.comment) {
									trash.comment = $scope.trashInfo.comment;
								}
								trashList.push(self.mapTrashInfoViewModelToTrashModel(trash));
							}
						}
						self.trashService.updateTrashRecord(trashList,
							(data) => {
								//update modifiedDate
								for (var i = 0; i < data.length; i++) {
									var trashInfo = data[i];
									self.updateModifiedDate(self.trashInfoViewModelList, trashInfo.id, trashInfo.modifiedDate);
								}
                self.showResultDialog('Updated ' + data.length + ' new records', event);
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

		updateTrashInfoChange(trashInfo: Model.TrashInformationViewModel) {
			var trashList = [];
			trashList.push(this.mapTrashInfoViewModelToTrashModel(trashInfo));
			var self = this;
			this.trashService.updateTrashRecord(trashList,
				(data) => {
					for (var i = 0; i < data.length; i++) {
						var trashInfo = data[i];
						self.updateModifiedDate(self.trashInfoViewModelList, trashInfo.id, trashInfo.modifiedDate);
					}
				},
				(data) => {
				});
		}

    deleteRecord(event: Event) {
      var trashList = [];
      for (var i = 0; i < this.trashInfoViewModelList.length; i++) {
        var trash = this.trashInfoViewModelList[i];
        if (trash.isSelected) {
          trashList.push(trash.id);
        }
      }

      var confirm = this.$mdDialog.confirm()
        .title('Are you sure you want to delete ' + trashList.length + ' records?')
        .targetEvent(event)
        .ok('OK')
        .cancel('Cancel');

      var self = this;
      this.$mdDialog.show(confirm).then(function () { 
				self.$rootScope.showSpinner();       
        self.trashService.deleteTrashRecord(trashList,
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
						self.trashInfoViewModelsOnPage = self.$filter('filter')(self.trashInfoViewModelList, self.search);
            self.numPages = Math.ceil(self.trashInfoViewModelsOnPage.length / self.itemsPerPage);
            self.selectedAll = false;
            self.showResultDialog('Deleted ' + data.length + ' records', event);
						self.$rootScope.hideSpinner();
          },
          (data) => {
						self.$rootScope.hideSpinner();
          });
      }, function () { });

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
					trashInfo.latitude = parseFloat(trashInfo.latitude.toFixed(3));
					trashInfo.longitude = parseFloat(trashInfo.longitude.toFixed(3));
					trashInfo.statusName = this.getStatusString(trashInfo.status);
					trashInfo.customId = trashInfo.size[0] + this.pad(trashInfo.id, 5);
					selectedTrashInfoList.push(trashInfo);
				}
			}
			this.$window.sessionStorage.setItem('selectedTrashInfoList', angular.toJson(selectedTrashInfoList));
			this.$window.open('/#/show_map_and_trash');
    }

    showMapAndImages(trashInfo: Model.TrashInformationViewModel) {
      trashInfo.assigneeName = this.getAssigneeName(trashInfo.assigneeId);
      trashInfo.statusName = this.getStatusString(trashInfo.status);
			trashInfo.latitude = parseFloat(trashInfo.latitude.toFixed(3));
			trashInfo.longitude = parseFloat(trashInfo.longitude.toFixed(3));
			trashInfo.customId = trashInfo.size[0] + this.pad(trashInfo.id, 5);
      this.$window.sessionStorage.setItem('selectedTrashInfo', angular.toJson(trashInfo));
      this.$window.open('/#/map_and_images');
    }

		itemsPerPageChanged(itemsPerPage) {
			this.currentPage = 1;
			this.numPages = Math.ceil(this.trashInfoViewModelsOnPage.length / itemsPerPage);
      this.clearAllSelected();
      return this.currentPage;
		}

		goToNextPage() {
			this.currentPage += 1;
			this.clearAllSelected();
			return this.currentPage;
		}

		getPageNumber() {
			return this.currentPage;
		}

		goToPreviousPage() {
			this.currentPage -= 1;
			this.clearAllSelected();
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
          $scope.errorMessage = '';

					$scope.cancel = function () {
						$mdDialog.cancel();
					};
					$scope.create = function () {
						self.userService.createAssignee($scope.assignee,
							(data) => {
								self.assigneeList.push(data);
								$mdDialog.hide();
							},
							(data) => {
                $scope.errorMessage = 'Assignee already exists';
							});
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
          $scope.errorMessage = '';

					$scope.cancel = function () {
						$mdDialog.cancel();
					};
					$scope.create = function () {
						self.userService.create($scope.adminUser,
							(data) => {
								$mdDialog.hide();
							},
							(data) => {
                $scope.errorMessage = 'Admin username already exists';
							});
					};
				},

				templateUrl: '/html/admin-dialog.html' + '?v=' + VERSION_NUMBER,
				targetEvent: event,
				clickOutsideToClose: false
			})
				.then(function (answer) { }, function () { });
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
      this.clearAllSelected();
			this.isReverse = (propertyName !== null && this.propertyName === propertyName) ? !this.isReverse : false;
			this.propertyName = propertyName;
			var trashList = this.$filter('filter')(this.trashInfoViewModelList, this.search);
			this.trashInfoViewModelsOnPage = this.$filter('orderBy')(trashList, this.propertyName, this.isReverse);
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
			this.clearAllSelected();
			this.searchText = null;
			this.search = {};
			this.numPages = Math.ceil(this.trashInfoViewModelList.length / this.itemsPerPage);
			this.trashInfoViewModelsOnPage = this.trashInfoViewModelList.slice(0);
		}

		clearAllSelected() {
			this.selectedAll = false;
			for (var i = 0; i < this.trashInfoViewModelList.length; i++) {
				this.trashInfoViewModelList[i].isSelected = false;
			}
		}

    dropRecord(event: Event) {
      var confirm = this.$mdDialog.confirm()
        .title('Are you sure you want to drop CSV and KML table?')
        .targetEvent(event)
        .ok('OK')
        .cancel('Cancel');

      var self = this;
      this.$mdDialog.show(confirm).then(function () {
        self.$rootScope.showSpinner();
        self.trashService.dropRecord(this.assigneeList, (data) => {
          self.polygonList = [];
          self.trashInfoViewModelList = [];
          self.numPages = 0;
          self.$rootScope.hideSpinner();
          self.showResultDialog('CSV Table and KML Table are cleared', event);
				}, function () { });
      }, function () { });
		}

		pad(str, max) {
			str = str.toString();
			if (str.length < max) {
				return this.pad('0' + str, max);
			}
			return str;
    }

    showResultDialog(message: string, event) {
      this.$mdDialog.show(
        this.$mdDialog.alert()
          .parent(angular.element(document.querySelector('#kiosksSurvey')))
          .clickOutsideToClose(true)
          .title(message)
          .ok('OK')
          .targetEvent(event)
      );
    }

	}
}