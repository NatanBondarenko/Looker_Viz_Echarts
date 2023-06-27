looker.plugins.visualizations.add({
  options: {
    title: {
      type: "string",
      label: "Chart Title",
      default: "ECharts Getting Started Example"
    },
    chartType: {
      type: "string",
      label: "Chart Type",
      display: "select",
      values: [
        { "Bar": "bar" },
        { "Line": "line" },
        { "Scatter": "scatter" }
      ],
      default: "bar"
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
      default: 20
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

    // Prepare the x-axis data from the first dimension
    var xAxisData = data.map(function(row) {
      return row[dimensions[0].name].value;
    });

    // Prepare the series data from the first measure
    var seriesData = data.map(function(row) {
      return row[measures[0].name].value;
    });

    // Get the configured chart title, type, and label options
    var chartTitle = config.title;
    var chartType = config.chartType;
    var showLabel = config.showLabel;
    var labelPosition = config.labelPosition;
    var labelFontSize = config.labelFontSize;

    // Specify the configuration items for the chart
    var option = {
      title: {
        text: chartTitle
      },
      tooltip: {},
      legend: {
        data: [measures[0].label]
      },
      xAxis: {
        data: xAxisData
      },
      yAxis: {},
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
