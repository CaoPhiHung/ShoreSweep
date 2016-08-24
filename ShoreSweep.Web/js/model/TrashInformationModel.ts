/// <reference path="BaseModel.ts" />

module Clarity.Model {

  export class TrashInformationModel extends Clarity.Model.BaseModel {
    public id: number;
    public trashId: number;
    public latitude: number;
    public longitude: number;
    public description: string;
    public status: string;
    public images: string;
    public imageList: Array<string>;
    public comment: string;
    public assigneeId: number;

    public continent: string;
    public country: string;
    public administrativeArea1: string;
    public administrativeArea2: string;
    public administrativeArea3: string;

    public locality: string;
    public subLocality: string;      
    public url: string;
    public size: string;
    public type: string;
    public sectionId: number;    
    public isSelected: boolean;
    public polygonCoords: any;
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
