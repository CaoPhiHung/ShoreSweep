/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />

module Clarity.Service {

  export class PolygonService extends BaseService {

    constructor($http: ng.IHttpService) {
      super($http);
      this.url = '/api/polygons';
    }


    importPolygons(entity: any, successCallback: Function, errorCallback: Function) {
      this.http.post('/api/importPolygons', { 'polygons': entity })
            .success((data) => { this.doCallback(successCallback, data); })
            .error(() => { this.doCallback(errorCallback, null); });
    } 

  }
}