
module Clarity.Helper {

  export class MainHelper {
    constructor() { };

    public getCurrentDateTimeString() {
      var d = new Date();
      var day, month, hh, mm, ss = '';
      var year = d.getFullYear();

      if (d.getMonth() + 1 < 10) {
        month = '0' + (d.getMonth() + 1);
      }
      else {
        month = '' + (d.getMonth() + 1);
      }

      if (d.getDate() < 10) {
        day = '0' + d.getDate();
      }
      else {
        day = '' + d.getDate();
      }

      if (d.getHours() < 10) {
        hh = '0' + d.getHours();
      }
      else {
        hh = '' + d.getHours();
      }

      if (d.getMinutes() < 10) {
        mm = '0' + d.getMinutes();
      }
      else {
        mm = '' + d.getMinutes();
      }

      if (d.getSeconds() < 10) {
        ss = '0' + d.getSeconds();
      }
      else {
        ss = '' + d.getSeconds();
      }

      var date = year + '/' + month + '/' + day + ' ' + hh + ':' + mm + ':' + ss;

      return date;
    }

    public formatDateTimeToString(dateStr: string) {
      var d = new Date(dateStr);
      var day, month, hh, mm, ss = '';
      var year = d.getFullYear();

      if (d.getMonth() + 1 < 10) {
        month = '0' + (d.getMonth() + 1);
      }
      else {
        month = '' + (d.getMonth() + 1);
      }

      if (d.getDate() < 10) {
        day = '0' + d.getDate();
      }
      else {
        day = '' + d.getDate();
      }

      if (d.getHours() < 10) {
        hh = '0' + d.getHours();
      }
      else {
        hh = '' + d.getHours();
      }

      if (d.getMinutes() < 10) {
        mm = '0' + d.getMinutes();
      }
      else {
        mm = '' + d.getMinutes();
      }

      if (d.getSeconds() < 10) {
        ss = '0' + d.getSeconds();
      }
      else {
        ss = '' + d.getSeconds();
      }

      var date = year + '/' + month + '/' + day + ' ' + hh + ':' + mm + ':' + ss;

      return date;
    }
    
  }
}