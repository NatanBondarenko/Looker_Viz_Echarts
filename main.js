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
      // Get the Looker query result data
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Dimension');
      data.addColumn('number', 'Measure');

      // Extract the data from Looker query response
      var rows = queryResponse['data']['rows'];
      for (var i = 0; i < rows.length; i++) {
        var dimension = rows[i]['dimension']['value'];
        var measure = rows[i]['measure']['value'];
        data.addRow([dimension, measure]);
      }

      // Set the options
      var options = {
        title: 'House Prices vs Size',
        hAxis: { title: 'Dimension' },
        vAxis: { title: 'Measure' },
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
