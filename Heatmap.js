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

    // Prepare the x-axis data from the first dimension
    var xAxisData = data.map(function(row) {
      return row[dimensions[0].name].value;
    });

    // Prepare the y-axis data from the second dimension
    var yAxisData = data.map(function(row) {
      return row[dimensions[1].name].value;
    });

    // Prepare the series data from the measure
    var seriesData = data.map(function(row) {
      return row[measures[0].name].value;
    });

    // Get the configured chart title and show label option
    var chartTitle = config.title;
    var showLabel = config.showLabel;
    var labelFontSize = config.labelFontSize;

    // Specify the configuration items for the chart
    var option = {
      title: {
        text: chartTitle
      },
      tooltip: {},
      xAxis: {
        data: xAxisData
      },
      yAxis: {
        data: yAxisData
      },
      series: [
        {
          name: measures[0].label,
          type: "heatmap",
          data: seriesData,
          label: {
            show: showLabel,
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
