import "core-js/stable";
import "regenerator-runtime/runtime";
import Data from './data/data.json';
import './styles/main.scss';

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 30},
  width = 640 - margin.left - margin.right,
  height = 480 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graph")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

let simulation = null;

fetch('http://localhost:3000/data.json')
    .then((response) => response.json())
    .then((data) => {
  // Initialize the links
  const link = svg.append('g')
    .attr('class', 'link')
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")

  // Initialize the nodes
  const node = svg.append('g')
    .attr('class', 'node')    
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", 20)

  const text = svg.append("g")
     .attr("class", "text")
     .selectAll("text")
     .data(data.nodes)
     .enter().append("text")
     .text(d => d.name)


    // Let's list the force we wanna apply on the network
    simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
    .id(function(d) { return d.id; })                     // This provide  the id of a node
    .links(data.links)                                    // and this the list of links
    )
    .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    .on("end", ticked);
           

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x + 6; })
         .attr("cy", function(d) { return d.y - 6; });

    text
         .attr('x', function(d) { return d.x - 5 })
         .attr('y', function(d) { return d.y })
  }

})
.catch(error => console.warn(error));
