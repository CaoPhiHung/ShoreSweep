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

      var image = {
      	url: '/img/white-transparent.png'
      };

      // create the map + marker
      var map = new google.maps.Map(element[0], options);
      var bounds = new google.maps.LatLngBounds();

      if (scope.ngMarkers) {//for map has many markers
        for (var i = 0; i < scope.ngMarkers.length; i++) {

          var marker = new MarkerWithLabel({
          	position: new google.maps.LatLng(scope.ngMarkers[i].latitude, scope.ngMarkers[i].longitude),
          	map: map,
          	labelContent: scope.ngMarkers[i].size[0] + '00' + scope.ngMarkers[i].id,
          	labelClass: "labels", // the CSS class for the label
          	labelInBackground: false,
          	icon: image
          });

          bounds.extend(marker.getPosition());
        }
        map.fitBounds(bounds);

        google.maps.event.addDomListener(window, "resize", function () {
        	var center = map.getCenter();
        	google.maps.event.trigger(map, "resize");
        	map.setCenter(center);
        });

      } else {//for map has 1 marker

      	var marker = new google.maps.Marker({
      		position: new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude),
      		map: map,
      		title: scope.ngModel.description
      	});
				
      	//var infowindow = new google.maps.InfoWindow();
      	//infowindow.setContent(scope.ngModel.size[0] + '00' + scope.ngModel.id);
      	//infowindow.open(map, marker);

      	//event click on marker
      	google.maps.event.addListener(marker, 'click', (function (marker) {
      		return function () {
      			var infowindow = new google.maps.InfoWindow();
      			infowindow.setContent(scope.ngModel.customId);
      			infowindow.open(map, marker);
      		}
      	})(marker));

      	//fix error only load right at first time
        google.maps.event.addListenerOnce(map, 'idle', function () {
        	google.maps.event.trigger(map, 'resize');
        	map.setCenter(center);
        	var infowindow = new google.maps.InfoWindow();
        	infowindow.setContent(scope.ngModel.size[0] + '00' + scope.ngModel.id);
        	infowindow.open(map, marker);
        });
      }

      google.maps.event.addDomListener(window, "resize", function () {
      	var center = map.getCenter();
      	google.maps.event.trigger(map, "resize");
      	map.setCenter(center);
      });
    }
  }
});