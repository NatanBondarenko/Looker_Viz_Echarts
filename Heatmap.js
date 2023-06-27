looker.plugins.visualizations.add({
  create: function(element, config) {
    // Create a container element for the chart
    element.innerHTML = '<div id="main" style="width: 600px;height:400px;"></div>';

    // Load ECharts library
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js';
    script.onload = function() {
      // Initialize the ECharts instance based on the prepared DOM
      var myChart = echarts.init(document.getElementById('main'));

      // Fetch data from Looker API
      looker.plugins.visualizations.dataSingleQuery({
        format: 'json', // Set the desired format
        query: 'SELECT hour, day, value FROM your_view', // Replace with your Looker query
        // You can pass additional parameters like filters, dimensions, or measures as required
        // filters: { ... },
        // dimensions: { ... },
        // measures: { ... },
        // ...
      }).then(function(data) {
        // Process the data returned from the API into the format required by the chart
        var chartData = data.map(function(item) {
          return [item.hour.value, item.day.value, item.value.value || '-'];
        });

        // Specify the configuration items and data for the chart
        var option = {
          tooltip: {
            position: 'top'
          },
          grid: {
            height: '50%',
            top: '10%'
          },
          xAxis: {
            type: 'category',
            data: hours,
            splitArea: {
              show: true
            }
          },
          yAxis: {
            type: 'category',
            data: days,
            splitArea: {
              show: true
            }
          },
          visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
          },
          series: [
            {
              name: 'Punch Card',
              type: 'heatmap',
              data: chartData,
              label: {
                show: true
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        // Display the chart using the configuration items and data
        myChart.setOption(option);
      });
    };

    // Append the ECharts script to the DOM
    document.head.appendChild(script);
  }
});
