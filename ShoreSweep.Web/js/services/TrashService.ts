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

    importTrashRecord(entity: any, successCallback: Function, errorCallback: Function) {
        this.http.post('/api/trash/importTrashRecord', { 'trashes': entity })
            .success((data) => { this.doCallback(successCallback, data); })
            .error(() => { this.doCallback(errorCallback, null); });
    } 

    updateTrashRecord(entity: any, successCallback: Function, errorCallback: Function) {
      this.http.post('/api/trash/updateTrashRecord', { 'trashes': entity })
        .success((data) => { this.doCallback(successCallback, data); })
        .error(() => { this.doCallback(errorCallback, null); });
    }

		deleteTrashRecord(entity: any, successCallback: Function, errorCallback: Function) {
      this.http.post('/api/trash/deleteTrashRecord', { 'trashes': entity })
        .success((data) => { this.doCallback(successCallback, data); })
        .error(() => { this.doCallback(errorCallback, null); });
    }


  }
}