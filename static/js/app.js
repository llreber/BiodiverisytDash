function buildMetadata(sample) {
  console.log(sample);
  // @TODO: Complete the following function that builds the metadata panel
  var urlMetadata = `/metadata/${sample}`;
    console.log(urlMetadata);
    // Use `.html("") to clear any existing metadata
    var selectTable = d3.select("#sample-metadata");
    selectTable.html("");
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(urlMetadata).then(function(data) {
 
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
       
      Object.entries(data).forEach(function([key, value]){
          console.log(key, value);
          var newRow = selectTable.append("tr");
          var cellKey = newRow.append("td");
          cellKey.text(key);
          var cellValue = newRow.append("td");
          cellValue.text(value);
      });
  });
}
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {
  console.log(sample);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  //console.log(url);
  d3.json(url).then(function(data) {
     //console.log(data);

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {x: data.otu_ids,
                  y: data.sample_values,
                  text: data.otu_labels,
                  mode: "markers",
                  marker: {color: data.otu_ids, symbol: "circle", size: data.sample_values},
                  type: "scatter"};
    //console.log(trace1);
    var data1 = [trace1];
    Plotly.plot("bubble", data1); 

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    var trace2 = {values: data.sample_values.slice(0,10),
                    labels: data.otu_labels.slice(0,10),
                    type: "pie"};
    //console.log(trace2);
    var data2 = [trace2];
    Plotly.plot("pie", data2);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      //console.log(sample);
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
   
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    //console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
