looker.plugins.visualizations.add({
  options: {
    title: {
      type: "string",
      label: "Chart Title",
      default: "ECharts Heatmap Example"
    },
    chartType: {
      type: "string",
      label: "Chart Type",
      display: "select",
      values: [
        { "Heatmap": "heatmap" },
        { "Bar": "bar" },
        { "Line": "line" },
        { "Scatter": "scatter" }
      ],
      default: "heatmap"
    },
    showLabel: {
      type: "boolean",
      label: "Show Label",
      default: true
    },
    labelPosition: {
      type: "string",
      label: "Label Position",
      display: "select",
      values: [
        { "Top": "top" },
        { "Right": "right" },
        { "Bottom": "bottom" },
        { "Left": "left" }
      ],
      default: "bottom"
    },
    labelFontSize: {
      type: "number",
      label: "Label Font Size",
      default: 12
    },
    visualMapMin: {
      type: "number",
      label: "Visual Map Min Value",
      default: 0
    },
    visualMapMax: {
      type: "number",
      label: "Visual Map Max Value",
      default: 10
    },
    visualMapCalculable: {
      type: "boolean",
      label: "Visual Map Calculable",
      default: true
    },
    visualMapOrient: {
      type: "string",
      label: "Visual Map Orientation",
      display: "select",
      values: [
        { "Horizontal": "horizontal" },
        { "Vertical": "vertical" }
      ],
      default: "horizontal"
    },
    visualMapLeft: {
      type: "string",
      label: "Visual Map Left Position",
      default: "center"
    },
    visualMapBottom: {
      type: "string",
      label: "Visual Map Bottom Position",
      default: "15%"
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

    // Prepare the x-axis data from the second dimension
    var xAxisData = data.map(function(row) {
      return row[dimensions[1].name].value;
    });

    // Prepare the y-axis data from the first dimension and aggregate the measures
    var yAxisData = [];
    var aggregatedData = {};

    data.forEach(function(row) {
      var yValue = row[dimensions[0].name].value;
      var measureValue = row[measures[0].name].value;

      if (!aggregatedData[yValue]) {
        yAxisData.push(yValue);
        aggregatedData[yValue] = {};
      }

      aggregatedData[yValue][row[dimensions[1].name].value] = measureValue;
    });

    // Prepare the series data from the aggregated measures
    var seriesData = yAxisData.map(function(yValue) {
      return xAxisData.map(function(xValue) {
        return aggregatedData[yValue][xValue] || 0;
      });
    });

    // Get the configured chart title, type, and label options
    var chartTitle = config.title;
    var chartType = config.chartType;
    var showLabel = config.showLabel;
    var labelPosition = config.labelPosition;
    var labelFontSize = config.labelFontSize;

    // Get the configured visualMap options
    var visualMapMin = config.visualMapMin;
    var visualMapMax = config.visualMapMax;
    var visualMapCalculable = config.visualMapCalculable;
    var visualMapOrient = config.visualMapOrient;
    var visualMapLeft = config.visualMapLeft;
    var visualMapBottom = config.visualMapBottom;

    // Specify the configuration items for the chart
    var option = {
      title: {
        text: chartTitle
      },
      tooltip: {
        position: "top"
      },
      visualMap: {
        min: visualMapMin,
        max: visualMapMax,
        calculable: visualMapCalculable,
        orient: visualMapOrient,
        left: visualMapLeft,
        bottom: visualMapBottom
      },
      xAxis: {
        type: "category",
        data: xAxisData
      },
      yAxis: {
        type: "category",
        data: yAxisData
      },
      series: [
        {
          name: measures[0].label,
          type: chartType,
          data: seriesData,
          label: {
            show: showLabel,
            position: labelPosition,
            textStyle: {
              fontSize: labelFontSize
            }
          }
        }
      ]
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
