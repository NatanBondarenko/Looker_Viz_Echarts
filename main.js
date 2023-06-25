looker.plugins.visualizations.add({
  create: function(element, config) {
    // Step 1) Load D3.js
    var d3Script = document.createElement('script');
    d3Script.src = 'https://d3js.org/d3.v6.min.js';
    document.head.appendChild(d3Script);

    // Step 2) Load billboard.js with style
    var billboardScript = document.createElement('script');
    billboardScript.src = '$YOUR_PATH/billboard.js';
    document.head.appendChild(billboardScript);

    // Load with base style
    var billboardCss = document.createElement('link');
    billboardCss.rel = 'stylesheet';
    billboardCss.href = '$YOUR_PATH/billboard.css';
    document.head.appendChild(billboardCss);

    // Or load different theme style
    var insightCss = document.createElement('link');
    insightCss.rel = 'stylesheet';
    insightCss.href = '$YOUR_PATH/theme/insight.css';
    document.head.appendChild(insightCss);

    // Step 3) Setup your chart holder
    var chartHolder = document.createElement('div');
    chartHolder.id = 'chart';
    element.appendChild(chartHolder);

    // Generate a chart with options
    var chart = null;

    // Return the visualization API methods
    return {
      updateAsync: function(data, element, config, queryResponse, details, done) {
        if (!chart) {
          // Create a new chart
          chart = bb.generate({
            bindto: '#chart',
            data: {
              columns: []
            }
          });
        }

        // Parse the Looker table data and format it for the chart
        var formattedData = [];
        var fields = queryResponse.fields.dimension_like.concat(queryResponse.fields.measure_like);
        formattedData.push(fields.map(function(field) {
          return field.label;
        }));
        formattedData = formattedData.concat(data.map(function(row) {
          return fields.map(function(field) {
            return row[field.name].value;
          });
        }));

        // Update the chart with the new data
        chart.load({
          columns: formattedData
        });

        // Signal to Looker that the update is complete
        done();
      }
    };
  }
});
