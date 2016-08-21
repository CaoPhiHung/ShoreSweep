var ngGoogleMap = ngGoogleMap || angular.module('google-map', []);

ngGoogleMap.directive('googleMap', function () {
    return {
        restrict: 'AE',
        replace: true,
        template: '<div></div>',
      scope: {
         trashInfo: '=trashInfo',
      },

      link: function (scope, element, attr) {
          var chartElement = element[0];
          // get map options
          var options =
              {
                  center: new google.maps.LatLng(40, -73),
                  zoom: 6,
                  mapTypeId: "roadmap"
              };

          // create the map
          map = new google.maps.Map(element[0], options);


          //var initMap = function() {
          //    // Create a map object and specify the DOM element for display.
          //    var map = new google.maps.Map(chartElement, {
          //        center: { lat: 10.7840241, lng: 106.67869879999999 },
          //        scrollwheel: false,
          //        zoom: 8
          //    });
          //}

          //initMap();

        }
    }
});