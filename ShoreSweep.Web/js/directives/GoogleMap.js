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
            //var triangleCoords = [
            //  { lat: 34.1635344, lng: -84.0254794 },
            //  { lat: 34.1699259, lng: -84.0148364 },
            //  { lat: 34.17021, lng: -84.009 },
            //  { lat: 34.1635344, lng: -84.0254794 },
            //  { lat: 34.1699259, lng: -84.0148364 },
            //  { lat: 34.17021, lng: -84.009 },
            //  { lat: 34.1741156, lng: -84.0085709 },
            //  { lng: -84.0064252, lat: 34.1760328 },
            //  { lng: -84.0004169, lat: 34.1801513 },
            //  { lng: -84.0220462, lat: 34.1984687 },
            //  { lng: -84.0517436, lat: 34.1903755 },
            //  { lng: -84.0603267, lat: 34.1731925 },
            //  { lng: -84.0462504, lat: 34.1660911 },
            //  { lng: -84.0254794, lat: 34.1635344 }
            //];

          // Construct the polygon.
            //var bermudaTriangle = new google.maps.Polygon({
            //  paths: triangleCoords,
            //  strokeColor: '#FF0000',
            //  strokeOpacity: 0.8,
            //  strokeWeight: 2,
            //  fillColor: '#FF0000',
            //  fillOpacity: 0.35
            //});
            //bermudaTriangle.setMap(map);

            //var isWithinPolygon = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude), bermudaTriangle);
            //alert(isWithinPolygon);
        }
    }
});