/// <reference path="BaseModel.ts" />

module Clarity.Model {

  export class PolygonModel extends Model.BaseModel {
    public name: string;
    public coordinates: Array<Coordinate>;
  }

}