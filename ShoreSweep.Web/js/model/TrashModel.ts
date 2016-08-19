/// <reference path="BaseModel.ts" />

module Clarity.Model {

  export class TrashModel extends Clarity.Model.BaseModel {
    public shoreSweepId: string;
    public latitude: string;
    public longtitude: string;
    public description: string;
    public status: string;
    public images: string;
    public comment: string;
    public assignee: string;
  }
}