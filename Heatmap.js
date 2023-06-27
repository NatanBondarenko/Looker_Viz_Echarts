looker.plugins.visualizations.add({
  options: {
    title: {
      type: "string",
      label: "Chart Title",
      default: "Heatmap Chart"
    },
    showLabel: {
      type: "boolean",
      label: "Show Label",
      default: true
    },
    labelFontSize: {
      type: "number",
      label: "Label Font Size",
      default: 12
    }
  },

  create: function(element, config) {
    // Create a container element for the chart
    var container = element.appendChild(document.createElement("div"));
    container.id = "main";
    container.style.width = "100%";
    container.style.height = "100%";
  },

updateAsync: function(data, element, config, queryResponse, details, done) {
  // Extract the dimensions and measures from the Looker query response
  var dimensions = queryResponse.fields.dimension_like;
  var measures = queryResponse.fields.measure_like;

  // Prepare the x-axis and y-axis data from the dimensions
  var xAxisData = data.map(function(row) {
    return row[dimensions[1].name].value;
  });

  var uniqueYAxisData = Array.from(new Set(xAxisData)); // Get unique y-axis values

  var yAxisData = data.map(function(row) {
    return row[dimensions[0].name].value;
  });

  var uniqueYAxisData = Array.from(new Set(yAxisData)); // Get unique y-axis values

  // Prepare the series data as a matrix
  var seriesData = [];
  for (var i = 0; i < uniqueYAxisData.length; i++) {
    var yValue = uniqueYAxisData[i];
    var seriesItem = {
      name: yValue,
      type: "heatmap",
      data: []
    };
    for (var j = 0; j < xAxisData.length; j++) {
      if (yAxisData[j] === yValue) {
        seriesItem.data.push([xAxisData[j], yValue, data[j][measures[0].name].value]);
      }
    }
    seriesData.push(seriesItem);
  }

  // Get the configured chart title, label options, and color options
  var chartTitle = config.title;
  var showLabel = config.showLabel;
  var labelPosition = config.labelPosition;
  var labelFontSize = config.labelFontSize;
  var colorScheme = config.colorScheme || "heatmap";

  // Specify the configuration items for the chart
  var option = {
    title: {
      text: chartTitle
    },
    tooltip: {
      position: "top"
    },
    grid: {
      top: 80,
      bottom: 30,
      left: 100
    },
    xAxis: {
      type: "category",
      data: xAxisData
    },
    yAxis: {
      type: "category",
      data: uniqueYAxisData
    },
    visualMap: {
      min: Math.min(...seriesData.map(function(item) { return item.data; }).flat().map(function(item) { return item[2]; })),
      max: Math.max(...seriesData.map(function(item) { return item.data; }).flat().map(function(item) { return item[2]; })),
      calculable: true,
      orient: "vertical",
      left: 10,
      top: "middle"
    },
    series: seriesData,
    color: colorScheme
  };

  // Initialize the echarts instance based on the container element
  var myChart = echarts.init(document.getElementById("main"));

  // Set responsive configuration
  window.addEventListener("resize", function() {
    myChart.resize();
  });

  // Update the chart with the new configuration and data
  myChart.setOption(option);

  // Signal to Looker that the update is complete
  done();

  }
});
