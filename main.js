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
      google.charts.setOnLoadCallback(function() {
        // Load the Google Charts API
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
      });
    };

    // Define the drawChart function
    function drawChart(dataTable) {
      // Set the options
      var options = {
        title: 'House Prices vs Size',
        hAxis: { title: 'Square Meters' },
        vAxis: { title: 'Price in Millions' },
        legend: 'none'
      };

      // Draw the chart
      var chart = new google.visualization.LineChart(document.getElementById('myChart'));
      chart.draw(dataTable, options);
    }

    // Load the Google Charts API
    script.onload = function () {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(window.googleChartsCallback);
    };
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    // Extract the data from the queryResponse
    var fields = queryResponse.fields.dimension_like.concat(queryResponse.fields.measure_like);
    var rows = queryResponse.data.map(function (row) {
      return fields.map(function (field) {
        return row[field.name].value;
      });
    });

    // Create the data table
    var dataTable = new google.visualization.DataTable();
    fields.forEach(function (field) {
      dataTable.addColumn(field.type, field.label);
    });
    dataTable.addRows(rows);

    // Call the drawChart function to update the chart
    drawChart(dataTable);

    // Signal the end of the update
    done();
  }
});
