var ngGoogleMap = ngGoogleMap || angular.module('google-map', []);

ngGoogleMap.directive('googleMap', function () {
    return {
      restrict: 'AE',
      scope: {
          //widgetModel: '=widgetModel',
          trashInfo: '=trashInfo',
      },

      link: function (scope, element, attr) {
          var chartElement = element[0];

          var initMap = function() {
              // Create a map object and specify the DOM element for display.
              var map = new google.maps.Map(chartElement, {
                  center: { lat: -34.397, lng: 150.644 },
                  scrollwheel: false,
                  zoom: 8
              });
          }

          initMap();

          //var drawWordCloud = function (size) {
          //  var widget = scope.widgetModel;
          //  if (angular.isDefined(widget)) {
          //    wordCloudSVG.update(size);
          //  }
          //};

          //function wordCloud(selector) {

          //  var fill = d3.scale.category20();
          //  //Construct the word cloud's SVG element
          //  var container = d3.select(selector).append("svg")
          //      .attr("id","word-cloud-svg")
          //      .attr("width", 900)
          //      .attr("height", 490);
          //  var svg = container.append("g")
          //      .attr("transform", "translate(450,245)");

          //  //Draw the word cloud
          //  function draw(words) {

          //    var colors = getFormatedColors(scope.widgetModel.data.wordCloud.colors);
          //    if (colors == undefined || colors.length == 0) {
          //      colors = scope.$root.defaultColors;
          //    }
          //    var color = d3.scale.ordinal()
          //                 .range(colors);
          //    var newFont = scope.widgetModel.data.wordCloud.fontFamily;
          //    var cloud = svg.selectAll("g text")
          //                    .data(words, function (d) { return d.text; })

          //    //Entering words
          //    cloud.enter()
          //        .append("text")
          //        .style("font-family", newFont)
          //        .style("fill", function (d, i) { if (colors.length > 0) { return color(i); }; return fill(i); })
          //        .style("color", function (d, i) { if (colors.length > 0) { return color(i); }; return fill(i); })
          //        .attr("text-anchor", "middle")
          //        .attr('font-size', 1)
          //        .text(function (d) { return d.text; });

          //    //Entering and existing words
          //    cloud
          //        .transition()
          //            //.duration(600)
          //            .duration(0)
          //            .style("font-family", newFont)
          //            .style("fill", function (d, i) { if (colors.length > 0) { return color(i); }; return fill(i); })
          //            .style("color", function (d, i) { if (colors.length > 0) { return color(i); }; return fill(i); })
          //            .style("font-size", function (d) { return d.size + "px"; })
          //            .attr("transform", function (d) {
          //              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          //            })
          //            .style("fill-opacity", 1);

          //    //Exiting words
          //    cloud.exit()
          //        .transition()
          //            //.duration(200)
          //            .duration(0)
          //            .style('fill-opacity', 1e-6)
          //            .attr('font-size', 1)
          //            .remove();
          //  }

          //  //Use the module pattern to encapsulate the visualisation code. We'll
          //  // expose only the parts that need to be public.
          //  return {
          //    //Recompute the word cloud for a new set of words. This method will
          //    // asycnhronously call draw when the layout has been computed.
          //    //The outside world will need to call this function, so make it part
          //    // of the wordCloud return value.
          //    update: function (size) {
          //      var wordCloudObj = scope.widgetModel.data.wordCloud;
          //      var offsetBaseNumber = scope.widgetModel.data.showBaseNumber ? 20 : 0;

          //      //update svg size
          //      container.attr("width", size.w).attr("height", size.h - offsetBaseNumber).attr("id", "word-cloud-svg-" + scope.widgetModel.id);
          //      svg.attr("transform", "translate(" + size.w / 2 + "," + size.h / 2 + ")");

          //      //get words
          //      var words = wordCloudObj.words;

          //      //calculate and return size of text by frequency, number of words and size of container
          //      if (words.length > 0) {
          //        words = calculateSizeWordCloud(words, size);
          //      }

          //      //draw
          //      d3.layout.cloud().size([size.w, size.h])
          //          .words(words)
          //          .padding(5)
          //          .rotate(function () {

          //            var orientations = wordCloudObj.orientation;
          //            var fromX = wordCloudObj.orientationFrom;
          //            var toY = wordCloudObj.orientationTo;

          //              if (fromX < 0) {
          //                  fromX = -Math.abs(fromX);
          //              } else {
          //                  fromX = Math.abs(fromX);
          //              }

          //              if (toY < 0) {
          //                  toY = -Math.abs(toY);
          //              } else {
          //                  toY = Math.abs(toY);
          //              }
          //              var rotation = [];

          //              if (orientations == 1 || orientations == 0 || orientations < 0) {
          //                  rotation = [fromX];
          //                  orientations = 1;
          //              } else if (orientations == 2) {
          //                  rotation = [fromX, toY];
          //              } else {
          //                  rotation = [fromX, toY];
          //                  var totalDegree = Math.abs(fromX) + Math.abs(toY);
          //                  var plus = totalDegree / (orientations - 1);

          //                  var count = 1;
          //                  for (var i = 2; i < orientations; i++) {
          //                      var newDegree = plus * count + fromX;
          //                      rotation.push(newDegree);
          //                      count++;
          //                  }
          //              }

          //              if (fromX == toY) {
          //                  rotation = [fromX];
          //                  orientations = 0;
          //              }

          //              var rotate = rotation[getRandomInt(0, Math.abs(orientations))];

          //              return rotate;
          //          })
          //          .font(wordCloudObj.fontFamily)
          //          .fontSize(function (d) { return d.size; })
          //          .on("end", draw)
          //          .start();
          //    }
          //  }
          //}

          //function calculateSizeWordCloud(words, containerSize) {

          //  var wordObjects = [];
          //  for (var i = 0; i < words.length; i++) {
          //    var word = words[i];
          //    wordObjects.push({ text: word.text, size: word.frequency });
          //  }

          //  var total = 0;
          //  for (var i = 0; i < wordObjects.length; i++) {
          //    total += wordObjects[i].size;
          //  }
          //  //maximum fontSize is containerSize.h / 7
          //  var factorNumber = (containerSize.h / 7) / (wordObjects[0].size / total);

          //  //update font size
          //  for (var i = 0; i < wordObjects.length; i++) {
          //    var percent = wordObjects[i].size / total;
          //    wordObjects[i].size = percent * factorNumber;
          //    if (wordObjects[i].size < 10) {
          //      wordObjects[i].size = 10;
          //    }
          //  }

          //  return wordObjects;
          //}

          //function getRandomInt(min, max) {
          //  return Math.floor(Math.random() * (max - min)) + min;
          //}

          //function getFormatedColors(rawColors) {
          //  var colors = [];
          //  for (var i = 0; i < rawColors.length; i++) {
          //    color = rawColors[i];
          //    if (color != '') {
          //      if (color.indexOf('#') == -1) {
          //        color = '#' + color;
          //      }
          //      colors.push(color);
          //    }
          //  }

          //  return colors;
          //}

          //scope.$watch('widgetModel', function (newValue, oldValue) {
          //  if (newValue) {

          //    var dashboardScope = scope.$parent.viewModel.parentScope;
          //    var figureInteractionHelper;

          //    if (dashboardScope != null && dashboardScope.dashboardInteractionHelper != null) {
          //      var uiConfig = dashboardScope.dashboardInteractionHelper.uIConfig;
          //      var grids = dashboardScope.dashboardInteractionHelper.grids;
          //      figureInteractionHelper = new Clarity.Helper.FigureInteractionHelper(element, scope.widgetModel, uiConfig, grids);
          //    }

          //    if (figureInteractionHelper != null) {
          //      var size = figureInteractionHelper.getDefaultChartSize(!dashboardScope.editMode);
          //      drawWordCloud(size);
          //      figureInteractionHelper.initMaxHeightCssForTableWidget(true);
          //    } else {
          //      drawWordCloud();
          //    }
          //  }
          //});

          //scope.$watch('$parent.figure.redrawGoogleChartSetting.size', function (newValue, oldValue) {
          //  if (newValue && scope.widgetModel) {
          //    if (newValue.h != null && newValue.w != null) {
          //      drawWordCloud(newValue);
          //    }
          //  }
          //});

        }
    }
});