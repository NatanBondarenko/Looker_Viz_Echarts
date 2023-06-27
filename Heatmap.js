looker.plugins.visualizations.add({
  create: function(element, config) {
    // Create a container element for the visualization
    var container = element.appendChild(document.createElement("div"));
    container.id = "myChart";
    container.style.width = "600px";
    container.style.height = "400px";

    // Initialize the echarts instance based on the container element
    var myChart = echarts.init(container);

    return { myChart: myChart };
  },

  updateAsync: function(data, element, config, queryResponse, details, done) {
    // Access the echarts instance
    var myChart = this.myChart;

    // Process the Looker data into the format expected by the visualization
    var hours = [];
    var days = [];
    var dataValues = [];

    // Extract data from the Looker query response
    data.forEach(function(row) {
      hours.push(row.hour.value);
      days.push(row.day.value);
      dataValues.push([row.hour.value, row.day.value, row.value.value || "-"]);
    });

    // Specify the configuration options for the chart
    var option = {
      tooltip: {
        position: "top"
      },
      grid: {
        height: "50%",
        top: "10%"
      },
      xAxis: {
        type: "category",
        data: hours,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: "category",
        data: days,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "15%"
      },
      series: [
        {
          name: "Punch Card",
          type: "heatmap",
          data: dataValues,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };

    // Set the chart options and render the chart
    myChart.setOption(option);

    // Signal that the update is complete
    done();
  }
});
