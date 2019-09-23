var samplelist = d3.select("#selSample");
var sampleid = "";
var sampleids = [];
var samples = [];

function plotbarchart(id) {
  d3.json("/samples.json").then((data) => {
    // get x y values for barchart
    samples = data.samples;
    //console.log(samples);
    
    var sample_values = samples.filter(sample => sample.id === id)[0].sample_values.slice(0,10).reverse();
    var otu_number = samples.filter(sample => sample.id === id)[0].otu_ids.slice(0,10).reverse();
    var otu_labels = samples.filter(sample => sample.id === id)[0].otu_labels.slice(0,10).reverse();

    var otu_ids = [];
    otu_number.forEach(data => {
      otu_ids.push(`"OTU"${data}`);
    });
  
    //console.log(sample_values);

    //create trace
    var trace1 = {
      y: otu_ids,
      x: sample_values,
      type: "bar",
      text: otu_labels,
      orientation: "h"
    
    };
    var dataforbar = [trace1];

    //plot the bar chart
    Plotly.newPlot("barchart", dataforbar);

  });
}

function plotbubblechart(id) {
  d3.json("/samples.json").then((data) => {
    // get x y values for barchart
    samples = data.samples;
    //console.log(samples);
    
    var sample_values = samples.filter(sample => sample.id === id)[0].sample_values;
    var otu_ids = samples.filter(sample => sample.id === id)[0].otu_ids;
    var otu_labels = samples.filter(sample => sample.id === id)[0].otu_labels;

    //console.log(sample_values);

    //create trace
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids
     }
          
    };

    var dataforbubble = [trace1];
    var layout = {
     // title: 'Marker Size',
      showlegend: false,
      height: 600,
      width: 1200
    };
    //plot the bar chart
    Plotly.newPlot("bubblechart", dataforbubble,layout);

  });
}

function plotgaugechart(id) {
  d3.json("/samples.json").then((data) => {
    var allinfo = data.metadata;
    //console.log(allinfo);

    var wfreq = allinfo.filter(sample => sample.id === id)[0].wfreq;
    console.log(wfreq);
    
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency" },
        sub: { text: "per week" },
        type: "indicator",
        mode: "gauge+number",
        
        
        gauge: {
          axis: { range: [0, 9] },
          steps: [
            { range: [0, 1], color:"gainsboro" },
            { range: [1, 2], color: "powderblue" },
            { range: [2, 3], color: "lightskyblue" },
            { range: [3, 4], color: "skyblue" },
            { range: [4, 5], color: "deepskyblue" },
            { range: [5, 6], color: "dodgerblue" },
            { range: [6, 7], color: "royalblue" },
            { range: [7, 8], color: "blue" },
            { range: [8, 9], color: "darkblue" }
           ],
          
         }
      }
    ];
    
    var layout = { margin: { t: 0, b: 0 },
     };
    Plotly.newPlot("gaugechart", data, layout);

  });
}

function info(id){
  d3.json("/samples.json").then((data) => {
  
    var allinfo = data.metadata;
    //console.log(allinfo);
    
    var lists = d3.select(".list-group");
    lists.html("");

    var metadataOne = allinfo.filter(sample => sample.id === id)[0];
    //console.log(metadataOne);
    Object.entries(metadataOne).forEach(([key, value]) => lists.append("p").append("strong").text(`${key}: ${value}`).attr("style", "margin-left:10px")); 

  
  }); 
}

// iterate through all sample ids and add them to the dropdown menu
d3.json("/samples.json").then((data) => {
  sampleids = data.names;
  //console.log(sampleids);
  sampleids.forEach(id => samplelist.append("option").text(id));
  
});


// change the plot based on the select sample id
samplelist.on("change", function() {
  // save the chosen id to var sampleid
  sampleid = d3.event.target.value;
  plotbarchart(sampleid);
  sampleidInt = parseInt(sampleid);
  plotgaugechart(sampleidInt);
  info(sampleidInt);
  plotbubblechart(sampleid);
});

// 
plotbarchart("940");
info(940);
plotgaugechart(940);
plotbubblechart("940");