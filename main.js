looker.plugins.visualizations.add({
  create: function (element, config) {
    // Add the Google Charts loader script
    var script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    document.head.appendChild(script);

    // Create a new <div> element to hold the chart
    var chartDiv = document.createElement('div');
    chartDiv.id = 'myChart';
    chartDiv.style.maxWidth = '700px';
    chartDiv.style.height = '400px';

    // Append the chart <div> to the main element
    element.appendChild(chartDiv);

    // Define the callback function to be called when the Google Charts API is loaded
    window.googleChartsCallback = function () {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(drawChart);
    };

    // Define the drawChart function
    function drawChart() {
      // Set the data
      var data = google.visualization.arrayToDataTable([
        ['Price', 'Size'],
        [50, 7], [60, 8], [70, 8], [80, 9], [90, 9], [100, 9],
        [110, 10], [120, 11], [130, 14], [140, 14], [150, 15]
      ]);

      // Set the options
      var options = {
        title: 'House Prices vs Size',
        hAxis: { title: 'Square Meters' },
        vAxis: { title: 'Price in Millions' },
        legend: 'none'
      };

      // Draw the chart
      var chart = new google.visualization.LineChart(document.getElementById('myChart'));
      chart.draw(data, options);
    }

    // Load the Google Charts API
    script.onload = function () {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(window.googleChartsCallback);
    };
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    // Call the drawChart function to update the chart
    window.googleChartsCallback();

    // Signal the end of the update
    done();
  }
});
