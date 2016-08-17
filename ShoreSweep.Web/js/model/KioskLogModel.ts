/// <reference path="BaseModel.ts" />

module Clarity.Model {

  export class KioskLogModel extends Clarity.Model.BaseModel {
    public interviewerId: string;
    public terminalId: number;
    public locationId: number;
    public numberOfCounter: number;
    public shift: number;

    public geoRequestedTime: string;
    public latitude: string;
    public longitude: string;  

    public startTime: string;
    public enterTime: string;
    public leaveTime: string;
    public finishedTime: string;

    public numberOfPax: number;
    public numberOfReceipt: number;
    public queueType: number; 
    public gender: number;
    public color: string;

    public remark1: string;
    public remark2: string;

    public isAbandon: boolean;
    public abandonReason: string;
  }

  export class ColorModel {
    public code: string;
    public name: string; 
  }

}
