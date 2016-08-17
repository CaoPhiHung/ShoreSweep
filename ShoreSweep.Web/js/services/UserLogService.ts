/// <reference path="../../lib/angular/angular.d.ts" />
/// <reference path="../../lib/angular/angular-cookies.d.ts" />

module Clarity.Service {
  import baseModel = Clarity.Model.BaseModel;

  export class UserLogService extends BaseService {

    constructor($http: ng.IHttpService) {
      super($http);
      this.url = '/api/userlog';
    }    
  }
}