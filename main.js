looker.plugins.visualizations.add({
  create: function(element, config) {
    // Create a container element for the chart
    var container = element.appendChild(document.createElement("div"));
    container.id = "main";
    container.style.width = "600px";
    container.style.height = "400px";
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

    // Specify the configuration items for the chart
    var option = {
      title: {
        text: "ECharts Getting Started Example"
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
          type: "bar",
          data: seriesData
        }
      ]
    };

    // Initialize the echarts instance based on the container element
    var myChart = echarts.init(document.getElementById("main"));

    // Update the chart with the new configuration and data
    myChart.setOption(option);

    // Signal to Looker that the update is complete
    done();
  }
});
