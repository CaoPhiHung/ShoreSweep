/// <reference path="BaseModel.ts" />

module Clarity.Model {

  export class UserLogModel extends Clarity.Model.BaseModel {
    public interviewerId: string;
    public terminalId: number;
    public locationId: number;
    public numberOfCounter: number;
    public shift: number;

    public loginLatitude: string;
    public loginLongitude: string;

    public logoutLatitude: string;
    public logoutLongitude: string;

    public loginTime: string;
    public logoutTime: string;    
  }
}
