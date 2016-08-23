/// <reference path="../../lib/angular/angular.d.ts" />

module Clarity.Controller {
  export interface IRootScope extends ng.IRootScopeService {
    user: Model.UserModel;

    error: string;
    onError(error?): any;

    selectedTrashInfoList: Array<Model.TrashInformationModel>;

    showSpinner();
    hideSpinner();

    saveViewPortPosition();
    scrollToPreviousViewPortPosition();

    clearCache();
    enableElements();
    disableElements();
  }
}
