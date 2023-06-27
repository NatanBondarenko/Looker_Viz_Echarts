looker.plugins.visualizations.add({
  create: function(element, config) {
    // Create a container element for the chart
    var container = element.appendChild(document.createElement("div"));
    container.id = "main";
    container.style.width = "600px";
    container.style.height = "400px";
  },
  update: function(data, element, config, queryResponse) {
    // Specify the configuration items and data for the chart
    var option = {
      title: {
        text: "ECharts Getting Started Example"
      },
      tooltip: {},
      legend: {
        data: ["sales"]
      },
      xAxis: {
        data: ["Shirts", "Cardigans", "Chiffons", "Pants", "Heels", "Socks"]
      },
      yAxis: {},
      series: [
        {
          name: "sales",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };

    // Initialize the echarts instance based on the container element
    var myChart = echarts.init(document.getElementById("main"));

    // Update the chart with the new configuration and data
    myChart.setOption(option);
  }
});
