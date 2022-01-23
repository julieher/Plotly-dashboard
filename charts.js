console.log("working");

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSamples[0];

    // *DELIVERABLE 3: Part 1  
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = metadataArray[0];

    // *END DELIVERABLE 3: Part 1   

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = firstSample.otu_ids;
    let otuLabels = firstSample.otu_lables;
    let sampleValues = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(sampleObj => "OTU: " + sampleObj).slice(0,10)//.reverse();
    //console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels

    }];
    var data = [barData];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Operational Taxonomic Unit (OTU) Samples" },
      yaxis: { autorange: "reversed" } // To chage the order since it was showing 1167 at last
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // DELIVERABLE 2:

    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Portland'
      }
    }];

    // 2. Create the layout for the bubble chart.
    // plot the trace object and layout
    var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    xaxis: { title: "OTU ID" },
    automargin: true,
    showlegend: false,
    height: 620,
    width: 1200,
    hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // DELIVERABLE 3: Part 2  

    // 3. Create a variable that holds the washing frequency.
    var washFrequency = parseFloat(firstMetadata.wfreq);
    //console.log(washFrequency);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washFrequency,
      title: { text: "<b> Belly Button Washing Frequency </b><br></br> Scrubs Per Week"},
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "darkblue" },
        bar: { color: "sandybrown" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "darkgrey",
        steps: [
          {range: [0,2], color: "azure"},
          {range: [2,4], color: "lightblue"},
          {range: [4,6], color: "cadetblue"},
          {range: [6,8], color: "steelblue"},
          {range: [8,10], color: "midnightblue"}
        ],
        threshold: {
          line: { color: "orangered", width: 4 },
          thickness: 0.75,
          value: 10
        }
      }
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true,
      width: 400,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "midnightblue"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

