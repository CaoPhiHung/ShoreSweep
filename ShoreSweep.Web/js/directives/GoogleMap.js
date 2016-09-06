var ngGoogleMap = ngGoogleMap || angular.module('google-map', []);

ngGoogleMap.directive('googleMap', function () {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div id="googleMap"></div>',
    scope: {
      ngModel: '=?',
      ngMarkers: '=?'
    },

    link: function (scope, element, attr) {
      var chartElement = element[0];
      var center = scope.ngModel ? new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude):
                scope.ngMarkers ? new google.maps.LatLng(scope.ngMarkers[0].latitude, scope.ngMarkers[0].longitude):null;
      // get map options
      var options = {
        center: center,
        zoom: 12,
        mapTypeId: "roadmap"
      };

      // create the map + marker
      var map = new google.maps.Map(element[0], options);
      var bounds = new google.maps.LatLngBounds();
      if (scope.ngMarkers) {//for map has many markers
        for (var i = 0; i < scope.ngMarkers.length; i++) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(scope.ngMarkers[i].latitude, scope.ngMarkers[i].longitude),
            map: map,
            title: scope.ngMarkers[i].id + '-' + scope.ngMarkers[i].size
          });
          //show title for marker
          var infowindow = new google.maps.InfoWindow();
          infowindow.setContent(scope.ngMarkers[i].id.toString());
          infowindow.open(map, marker);
          //event click on marker
          google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
              var infowindow = new google.maps.InfoWindow();
              infowindow.setContent(scope.ngMarkers[i].id.toString());
              infowindow.open(map, marker);
            }
          })(marker));

          bounds.extend(marker.getPosition());
        }
        map.fitBounds(bounds);

      } else {//for map has 1 marker
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude),
          map: map,
          title: scope.ngModel.description
        });
        //event click on marker
        google.maps.event.addListener(marker, 'click', (function (marker) {
          return function () {
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(scope.ngModel.size);
            infowindow.open(map, marker);
          }
        })(marker));
      }

      //fix error only load right at first time
      google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);        
        if (!scope.ngMarkers) {
          var infowindow = new google.maps.InfoWindow();
          infowindow.setContent(scope.ngModel.size);
          infowindow.open(map, marker);
        }   
        
      });

      //google.maps.event.addListener(marker, 'click', (function (marker) {
      //  return function () {
      //    var infowindow = new google.maps.InfoWindow();
      //    infowindow.setContent(scope.ngModel.id + '-' + scope.ngModel.size);
      //    infowindow.open(map, marker);
      //  }
      //})(marker));

    }
  }
});