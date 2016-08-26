/// <reference path="BaseModel.ts" />

module Clarity.Model {

  export class TrashInformationModel extends Clarity.Model.BaseModel {
    public id: number;
    public trashId: number;
    public latitude: number;
    public longitude: number;
    public continent: string;
    public country: string;
    public administrativeArea1: string;
    public administrativeArea2: string;
    public administrativeArea3: string;
    public locality: string;
    public subLocality: string;  
    public description: string;
    public comment: string;
    public status: string;
    public url: string;
    public images: string;
    public size: string;
    public type: string;
    public assigneeId: number;
    public sectionId: number;
    public imageList: Array<string>;    
    public isSelected: boolean;
    public polygonCoords: any;
  }

  export class TrashInformationViewModel extends TrashInformationModel {
    
    public sectionName: string;
    public assigneeName: string;

  }

  export class Coordinate {
    public lng: number;
    public lat: number;

    constructor(longitude: number, latitude: number) {
      this.lng = longitude;
      this.lat = latitude;
    }
  }

}
