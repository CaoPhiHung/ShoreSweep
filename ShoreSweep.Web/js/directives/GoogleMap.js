var ngGoogleMap = ngGoogleMap || angular.module('google-map', []);

ngGoogleMap.directive('googleMap', function () {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div id="googleMap"></div>',
    scope: {
      ngModel: '=',
    },

    link: function (scope, element, attr) {
      var chartElement = element[0];
      // get map options
      var options = {
        center: new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude),
        zoom: 6,
        mapTypeId: "roadmap"
      };

      // create the map
      var map = new google.maps.Map(element[0], options);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude),
        map: map,
        label: scope.ngModel.id + '',
        title: scope.ngModel.id + '-' + scope.ngModel.size
      });

      //fix error only load right at first time
      google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude));
      });

      google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
          var infowindow = new google.maps.InfoWindow();
          infowindow.setContent(scope.ngModel.id + '-' + scope.ngModel.size);
          infowindow.open(map, marker);
        }
      })(marker));

      // Define the LatLng coordinates for the polygon's path.
      var polygonCoords = scope.ngModel.polygonCoords;
      if (polygonCoords) {
        // Construct the polygon.
        var polygon = new google.maps.Polygon({
          paths: polygonCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        polygon.setMap(map);
      }
    }
  }
});