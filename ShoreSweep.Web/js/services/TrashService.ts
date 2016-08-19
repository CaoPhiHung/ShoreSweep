/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />

module Clarity.Service {

  export class TrashService extends BaseService {

    constructor($http: ng.IHttpService) {
      super($http);
      this.url = '/api/trashes';
    }

    importCSV(fileUpload, successCallback, errorCallback) {
      this.http.post('/api/trash/importCSV', fileUpload, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity })
        .success((data) => {
          this.doCallback(successCallback, data);
        })
        .error((data) => {
          this.doCallback(errorCallback, data);
        });
    }

  }
}