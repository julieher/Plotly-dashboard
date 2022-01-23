// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata;
    var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample)

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = metaArray[0];

    // 3. Create a variable that holds the washing frequency.
   var washFrequency = firstMetadata.wfreq;
   console.log(washFrequency);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
    mode: "gauge+number+delta",
    value: washFrequency,
    title: { text: "<b> Belly Button Washing Frequency </b><br></br> Scrubs Per Week"},
    delta: { reference: 4, increasing: { color: "sandybrown" } },
    gauge: {
      axis: { range: [null, 10], tickwidth: 2, tickcolor: "darkblue" },
      bar: { color: "cadetblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        {range: [0,2], color: "azure"},
        {range: [2,4], color: "lightblue"},
        {range: [4,6], color: "steelblue"},
        {range: [6,8], color: "steelblue"},
        {range: [8,10], color: "midnightblue"}
      ],
      threshold: {
        line: { color: "orange", width: 4 },
        thickness: 0.75,
        value: 10
      }
    }
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "midnightblue"}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
