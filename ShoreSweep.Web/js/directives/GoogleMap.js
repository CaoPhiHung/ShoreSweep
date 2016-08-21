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
                title: scope.ngModel.description
            });
            //fix error only load right at first time
            google.maps.event.addListenerOnce(map, 'idle', function () {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(new google.maps.LatLng(scope.ngModel.latitude, scope.ngModel.longitude));
            });

        }
    }
});